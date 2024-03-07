<template>
  <!-- 事件预警模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-45">
    <div class="xpanel xpanel-r-b">
      <div class="title"><i class="event-warning-title">事件预警</i>
        <!--
          日期指定:
          日期的输入格式如:2022-11-04,点击查询会立即查询特定日期特定时间的数据
          当天车辆事件更新后,会自动设置该字段为当天日期
        -->
        <input class="event-warning-input" type="text" name="time" placeholder="日期" size=6 id="EventDay" v-model="inputTime" readonly>
        <!-- <input type="button" value="查询" class="event-warning-input-button" @click="getSpecificDayCarEventData"> -->
      </div>
      <table style="height: 440px;">
        <thead><tr>
          <th>时间</th>
          <th>车牌</th>
          <th>位置</th>
          <th>类型</th>
        </tr></thead>
        <tbody style="height: 420px;">
        <tr v-for="data in carEventTable" @click="alertCarEvent(data)" class="no-select">
          <td>{{ data.time }}</td>
          <td>{{ data.id }}</td>
          <td>{{ data.location }}</td>
          <td>{{ data.eventType }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useEventStore} from "@/store/module/event.ts";
import {onMounted, ref} from "vue";
import {EVENT_FLUSH_INTERVAL} from "@/static/interval.ts";
import {AlertCarEventBus} from "@/util/mitt.ts";
import {EventQueryData, EventQueryEntity} from "@/model/module.ts";
import {storeToRefs} from "pinia";

// 事件预警模块状态库
const eventStore = useEventStore();
const {carEventTable} = storeToRefs(eventStore);
// 车辆事件指定时间
const inputTime = ref<string>('');
// 获取今日车辆事件的定时任务ID
const todayCarEventDataTimer = ref<number|undefined>();
// 历史回放模式使能标志
const eventAlertDisabled = ref<boolean>(false);

/**
 * getTodayCarEventData()
 * 获取今日车辆事件信息数据
 */
async function getTodayCarEventData() {
  let res = await eventStore.getTodayCarEvent();
  if (!res) { return; }
  inputTime.value = (res as EventQueryData).day;
}

/**
 * getSpecificDayCarEventData()
 * 获取指定日期车辆事件信息数据
 */
// @ts-ignore
async function getSpecificDayCarEventData() {
  clearInterval(todayCarEventDataTimer.value);
  await eventStore.getSpecificDayCarEvent(inputTime.value);
  setTimelyTask();
}

/**
 * alertCarEvent()
 * (总线事务)指定车辆事件时,切换到历史回放模式
 */
function alertCarEvent(data:EventQueryEntity) {
  if (!eventAlertDisabled.value) {
    AlertCarEventBus.emit('model', {
      model: 2,
      name: data.id,
      time: data.time,
      trajId: data.trajId,
    });
  }
}

function setTimelyTask() {
  todayCarEventDataTimer.value = window.setInterval(getTodayCarEventData,EVENT_FLUSH_INTERVAL);
}

/**
 * 总线事务-历史回放模式入口开关
 * Model模块根据目前所处的动画模式,控制模式的入口开关
 */
AlertCarEventBus.on('event', (flag) => {
  eventAlertDisabled.value = !flag;
})

onMounted(() => {
  eventStore.clearCarEventTable();
  getTodayCarEventData();
  setTimelyTask();
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
