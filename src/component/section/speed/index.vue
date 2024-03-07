<template>
  <!-- 断面速度分析模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-30 section-speed-frame" id="more">
    <div class="xpanel xpanel-c-b">
      <div class="title title-long"> <i class="section-speed-title">断面速度分析</i>
        <input type="text" name="time" placeholder="日期" class="section-speed-input" size=6 id="TodayTimeSpeed" v-model="inputTime" readonly>
        <!--
          断面和时间段选择:
          选择指定断面后,会将上次查找数据中对应断面的数据导入图表
          选择指定时间段后,会自动查找当天指定时间的断面数据(仅平均断面速度模式时可选)
        -->
        <select name="sectionDropdownList" id="selectSecSpeed" @change="switchToSection" class="section-speed-select" v-model="selectSec" :disabled="selectDisabled">
          <option v-for="option in selectSecOptions" :value="option.value">{{ option.label }}</option>
        </select>
        <select name="sectionDropdownList" id="selectVTime" @change="getTodaySecData" class="section-speed-select" v-model="selectVTime" :disabled="selectDisabled">
          <option v-for="option in selectTimeOptions" :value="option.value">{{ option.label }}</option>
        </select>
        <!--
          断面速度模式选择:
          1:实时断面速度;2:平均断面速度
          模式改变后会自动获取对应的断面数据
        -->
        <select name="secSpeedModel" id="secSpeedModel" @change="switchSecSpeedModel" class="section-speed-select" v-model="selectSpeedModel">
          <option v-for="option in selectSpeedModelOptions" :value="option.value">{{ option.label }}</option>
        </select>
      </div>
      <div class="grid-container-h">
        <v-chart style="height: 320px;width: 1000px;" :option="eChartsSectionSpeedRightData"/>
        <v-chart style="height: 320px;width: 1000px;" :option="eChartsSectionSpeedLeftData"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useSectionStore} from "@/store/module/section.ts";
import {SelectOption} from "@/model/index.ts";
import "echarts";
import VChart from "vue-echarts";
import {
  eChartsSectionSpeedRightData,
  eChartsSectionSpeedLeftData,
  clearEChartsData,
} from "@/static/echarts.ts";
import {storeToRefs} from "pinia";
import {secTableDataSortByDate} from "@/util/process.ts";
import {SECTION_SPEED_AVG_FLUSH_INTERVAL, SECTION_SPEED_LASTED_FLUSH_INTERVAL} from "@/static/interval.ts";
import {SecQueryData, SecTableData} from "@/model/module.ts";

// 断面模块状态库
const sectionStore = useSectionStore();
const {selectSecOptions, selectTimeOptions} = storeToRefs(sectionStore);
// 断面选择支
const selectSec = ref<number>(2000);
// 断面时间段选择支
const selectVTime = ref<number>(60);
// 断面数据日期
const inputTime = ref<string>('');
// 断面速度分析模式选择支
const selectSpeedModel = ref<number>(2);
// 禁用标志位(处于实时断面速度模式时,禁止选择断面时间段)
const selectDisabled = computed(() => {
  return selectSpeedModel.value === 1;
});
// 断面速度分析模式选项
const selectSpeedModelOptions = ref<Array<SelectOption>>([
  { label: '实时断面速度', value: 1 },
  { label: '平均断面速度', value: 2 },
]);
// 断面速度数据
const sectionSpeedData = ref<Array<SecTableData>>([]);
// 不同断面速度分析模式下,获取断面速度的定时任务ID
const sectionSpeedAvgTimer = ref<number|undefined>(undefined);
const sectionSpeedLastedTimer = ref<number|undefined>(undefined);

/**
 * initSectionSpeedSelect()
 * 获取选择支信息,并初始化模块中相关选择项的值
 */
async function initSectionSpeedSelect() {
  await sectionStore.getSelectOptions();
  selectSec.value = selectSecOptions.value[0].value;
  selectVTime.value = selectTimeOptions.value[0].value;
  selectSpeedModel.value = 2;
  inputTime.value = '';
}

/**
 * updateSectionSpeedData()
 * 执行查询后,更新断面速度数据信息(平均断面速度模式)
 * @param data 断面数据
 */
function updateSectionSpeedData(data:SecQueryData) {
  // 合并相同断面不同时间的数据,按时间的先后排序
  for (let elem of selectSecOptions.value) {
    sectionSpeedData.value.push({
      name: elem.label,
      value: elem.value,
      data: data.entities.filter(i => i.xsecValue === elem.value).sort(secTableDataSortByDate),
    });
  }
}

/**
 * combineSectionSpeedData()
 * 执行查询后,更新断面速度数据信息(实时断面速度模式)
 * @param data 断面数据
 */
function combineSectionSpeedData(data:SecQueryData) {
  // 合并不同断面相同时间的数据
  for (let elem of selectSecOptions.value) {
    sectionSpeedData.value.push({
      name: elem.label,
      value: elem.value,
      data: data.entities.filter(i => i.xsecValue === elem.value),
    });
  }
}

/**
 * updateEChartsData()
 * 更新折线图数据
 */
function updateEChartsData() {
  // 1是实时断面速度;2是平均断面速度
  if (selectSpeedModel.value === 2) {
    let speedData = sectionSpeedData.value.find(i => i.value === selectSec.value)!.data;
    // 断面数据时间数据格式为2022-11-04|16:11,获取后半部分
    eChartsSectionSpeedRightData.value.xAxis.data = speedData.map(elem => elem.time.split("|")[1]);
    eChartsSectionSpeedRightData.value.series[0].data = speedData.map(i => i.avgSpeedright);
    eChartsSectionSpeedLeftData.value.xAxis.data = speedData.map(elem => elem.time.split("|")[1]);
    eChartsSectionSpeedLeftData.value.series[0].data = speedData.map(i => i.avgSpeedleft);
  } else {
    let speedDataX = sectionSpeedData.value.map(elem => elem.name);
    let speedDataY = sectionSpeedData.value.map(elem => elem.data[0]);
    eChartsSectionSpeedRightData.value.xAxis.data = speedDataX;
    eChartsSectionSpeedRightData.value.series[0].data = speedDataY.map(i => i.avgSpeedright);
    eChartsSectionSpeedLeftData.value.xAxis.data = speedDataX;
    eChartsSectionSpeedLeftData.value.series[0].data = speedDataY.map(i => i.avgSpeedleft);
  }
}

/**
 * batchClearEChartsData()
 * 清空折线图数据
 */
function batchClearEChartsData() {
  clearEChartsData(eChartsSectionSpeedLeftData);
  clearEChartsData(eChartsSectionSpeedRightData);
}

/**
 * switchToSection()
 * 选择不同断面后,清空先前的折线图数据,填充对应数据
 */
function switchToSection() {
  batchClearEChartsData();
  updateEChartsData();
}

/**
 * getTodaySecData()
 * 获取今日的指定时间段断面速度数据信息,并同步更新断面数据和折线图
 * 成功更新后会自动设置日期字段为当天日期
 */
async function getTodaySecData() {
  await sectionStore.getTodaySecData(selectVTime.value).then((data) => {
    if (data) {
      sectionSpeedData.value = [];
      updateSectionSpeedData(data);
      batchClearEChartsData();
      updateEChartsData();
      inputTime.value = data.time;
    }
  })
}

/**
 * getLastedSecData()
 * 实时断面速度模式下,获取最新断面速度数据信息,并同步更新断面数据和折线图
 * 成功更新后会自动设置日期字段为当天日期
 */
async function getLastedSecData() {
  await sectionStore.getLastedSecData().then((data) => {
    if (data) {
      sectionSpeedData.value = [];
      combineSectionSpeedData(data);
      batchClearEChartsData();
      updateEChartsData();
      inputTime.value = data.time;
    }
  })
}

/**
 * switchSecSpeedModel()
 * 切换断面速度模式后,执行查询和设置定时任务
 */
async function switchSecSpeedModel() {
  // 1是实时断面速度;2是平均断面速度
  if (selectSpeedModel.value === 1) {
    // 设置对应模式的定时任务,取消另一模式的定时任务(下方同理)
    clearInterval(sectionSpeedLastedTimer.value);
    await getLastedSecData();
    sectionSpeedLastedTimer.value = window.setInterval(getLastedSecData,SECTION_SPEED_LASTED_FLUSH_INTERVAL);
  } else {
    clearInterval(sectionSpeedLastedTimer.value);
    await getTodaySecData();
    sectionSpeedAvgTimer.value = window.setInterval(getTodaySecData,SECTION_SPEED_AVG_FLUSH_INTERVAL);
  }
}

onMounted(() => {
  sectionSpeedData.value = [];
  initSectionSpeedSelect();
  switchSecSpeedModel();
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
