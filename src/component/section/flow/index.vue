<template>
  <!-- 断面流量分析模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-60">
    <div class="xpanel xpanel-l-b">
      <div class="title"><i class="section-flow-title">断面流量分析</i>
        <!--
          日期指定:
          日期的输入格式如:2022-11-04,点击查询会立即查询特定日期特定时间的数据
          当天断面数据更新后,会自动设置该字段为当天日期
        -->
        <input type="text" name="time" placeholder="日期" class="section-flow-input-text" size=6 v-model="inputTime" readonly>
        <!-- <input type="button" value="查询" class="section-flow-input-button" @click="getSpecificDaySecData"> -->
      </div>
      <br>
        <!--
          断面和时间段选择:
          选择指定断面后,会将上次查找数据中对应断面的数据导入图表
          选择指定时间段后,会自动查找当天指定时间的断面数据
        -->
        <form class="section-flow-form">
          <select @change="switchToSection" class="section-flow-form-select" v-model="selectSec">
            <option v-for="option in selectSecOptions" :value="option.value">{{ option.label }}</option>
          </select>
          <select @change="getTodaySecData" class="section-flow-form-select" v-model="selectQTime">
            <option v-for="option in selectTimeOptions" :value="option.value">{{ option.label }}</option>
          </select>
        </form>
      <br>
      <div class="grid-container">
        <v-chart style="height: 300px;width: 500px;" :option="eChartsSectionFlowRightData"/>
        <v-chart style="height: 300px;width: 500px;" :option="eChartsSectionFlowLeftData"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {
  eChartsSectionFlowRightData,
  eChartsSectionFlowLeftData,
  clearEChartsData,
} from "@/static/echarts.ts";
import {useSectionStore} from "@/store/module/section.ts";
import {SECTION_FLOW_FLUSH_INTERVAL} from "@/static/interval.ts";
import "echarts";
import VChart from "vue-echarts";
import {storeToRefs} from "pinia";
import {secTableDataSortByDate} from "@/util/process.ts";
import {SecQueryData, SecTableData} from "@/model/module.ts";

// 断面模块状态库
const sectionStore = useSectionStore();
const {selectSecOptions, selectTimeOptions} = storeToRefs(sectionStore);
// 断面选择支
const selectSec = ref<number>(2000);
// 断面时间段选择支
const selectQTime = ref<number>(60);
// 断面指定日期
const inputTime = ref<string>('');
// 断面流量数据
const sectionFlowData = ref<Array<SecTableData>>([]);
// 获取当天断面数据的定时任务ID
const sectionFlowTodayDataTimer = ref<number|undefined>(undefined);

/**
 * initSectionFlowSelect()
 * 获取选择支信息,并初始化模块中相关选择项的值
 */
async function initSectionFlowSelect() {
  await sectionStore.getSelectOptions();
  selectSec.value = selectSecOptions.value[0].value;
  selectQTime.value = selectTimeOptions.value[0].value;
  inputTime.value = '';
}

/**
 * updateSectionFlowData()
 * 执行查询后,更新断面流量数据信息
 * @param data 断面数据
 */
function updateSectionFlowData(data:SecQueryData) {
  for (let elem of selectSecOptions.value) {
    // 合并相同断面不同时间的数据,按时间的先后排序
    sectionFlowData.value.push({
      name: elem.label,
      value: elem.value,
      data: data.entities.filter(i => i.xsecValue === elem.value).sort(secTableDataSortByDate),
    })
  }
}

/**
 * updateEChartsData()
 * 执行查询/选择不同断面后,更新对应的折线图数据
 */
function updateEChartsData() {
  let flowData = sectionFlowData.value.find(i => i.value === selectSec.value)!.data;
  eChartsSectionFlowRightData.value.xAxis.data = flowData.map(i => i.time.split("|")[1]);
  eChartsSectionFlowRightData.value.series[0].data = flowData.map(i => i.avgQright);
  eChartsSectionFlowLeftData.value.xAxis.data = flowData.map(i => i.time.split("|")[1]);
  eChartsSectionFlowLeftData.value.series[0].data = flowData.map(i => i.avgQleft);
}

/**
 * batchClearEChartsData()
 * 清空折线图数据
 */
function batchClearEChartsData() {
  clearEChartsData(eChartsSectionFlowLeftData);
  clearEChartsData(eChartsSectionFlowRightData);
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
 * 获取今日的断面流量数据信息,并同步更新断面数据和折线图
 * 成功更新后会自动设置日期字段为当天日期
 */
async function getTodaySecData() {
  await sectionStore.getTodaySecData(selectQTime.value).then((data) => {
    if (data) {
      sectionFlowData.value = [];
      batchClearEChartsData();
      updateSectionFlowData(data);
      updateEChartsData();
      inputTime.value = data.time;
    }
  })
}

/**
 * getSpecificDaySecData()
 * 获取特定日期的断面流量数据信息,并同步更新断面数据和折线图(暂时缺数据禁用)
 */
// @ts-ignore
async function getSpecificDaySecData() {
  // 防止定时任务刷新,重置其计时操作
  clearInterval(sectionFlowTodayDataTimer.value);
  await sectionStore.getSpecificDaySecData(inputTime.value,selectQTime.value).then((data) => {
    if (data) {
      sectionFlowData.value = [];
      batchClearEChartsData();
      updateSectionFlowData(data);
      updateEChartsData();
    }
  })
  setTimelyTask();
}

function setTimelyTask() {
  sectionFlowTodayDataTimer.value = window.setInterval(getTodaySecData, SECTION_FLOW_FLUSH_INTERVAL);
}

onMounted(() => {
  sectionFlowData.value = [];
  initSectionFlowSelect();
  getTodaySecData();
  setTimelyTask();
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
