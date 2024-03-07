<template>
  <!-- 设备管理模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-30">
    <div class="xpanel xpanel-r-m">
      <div class="title"><i class="device-manage-title">设备管理</i>
        <!--
          设备类型选择:
          1:微波雷达(默认值);2:牌照设备
          选择项发生改变后,会自动查询对应类型的设备信息(同时影响设备数量的统计)
        -->
        <select @change="getDeviceDataFromSwitch" class="device-manage-select" v-model="selectDeviceType">
          <option v-for="option in selectDeviceTypeOption" :value="option.value">{{ option.label }}</option>
        </select>
        <span class="device-manage-num-left">{{ deviceOnStateCount }}</span>
        <span class="device-manage-num-right">/</span>
        <span class="device-manage-num-right">{{ deviceAllCount }}</span>
      </div>
      <table style="height: 250px;">
        <thead><tr>
          <th>设备号</th>
          <th>安装位置</th>
          <th>道路幅向</th>
          <th>在线</th>
        </tr></thead>
        <tbody style="height: 300px;">
          <tr v-for="data in deviceTable">
            <td>{{ data.deviceId }}</td>
            <td>{{ data.loc }}</td>
            <td>{{ data.roadDirect }}</td>
            <td :style="{ color: getDeviceStateColor(data.state) }">{{ data.state }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useDeviceStore} from "@/store/module/device.ts";
import {DEVICE_FLUSH_INTERVAL} from "@/static/interval.ts";
import {SelectOption} from "@/model/index.ts";
import {storeToRefs} from "pinia";

// 设备管理模块状态库
const deviceStore = useDeviceStore();
const {deviceTable,deviceAllCount,deviceOnStateCount} = storeToRefs(deviceStore);
// 设备类型选择支
const selectDeviceType = ref<number>(1);
// 设备类型选项
const selectDeviceTypeOption = ref<Array<SelectOption>>([
  { label: '微波雷达', value: 1 },
  { label: '牌照设备', value: 2 },
]);
// 获取设备信息的定时任务ID
const getRadarOrLicenseDataTimer = ref<number|undefined>(undefined);

/**
 * getDeviceStateColor()
 * 计算设备在线状态颜色样式,和统计数据颜色保持一致
 * @param state 设备状态(在线/离线)
 */
function getDeviceStateColor(state:string) {
  return state === '在线'?'#EEC221FF':'#6098FDFF';
}

/**
 * getRadarOrLicenseData()
 * 更新状态库中微波雷达/牌照设备信息
 */
async function getRadarOrLicenseData(){
  if (selectDeviceType.value === 1) {
    await deviceStore.getRadarDeviceData();
  } else {
    await deviceStore.getLicenseDeviceData();
  }
}

/**
 * getDeviceDataFromSwitch()
 * 切换查询设备类型时主动进行查询,同时重置定时任务
 */
async function getDeviceDataFromSwitch() {
  clearInterval(getRadarOrLicenseDataTimer.value);
  await getRadarOrLicenseData();
  setTimelyTask();
}

function setTimelyTask() {
  getRadarOrLicenseDataTimer.value = window.setInterval(getRadarOrLicenseData, DEVICE_FLUSH_INTERVAL);
}

onMounted(() => {
  deviceStore.clearDeviceTable();
  getDeviceDataFromSwitch();
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
