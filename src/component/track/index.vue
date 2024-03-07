<template>
  <!-- 轨迹查询模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-40">
    <div class="xpanel xpanel-l-t">
      <div class="title">
        <i class="track-query-title">轨迹查询</i>
      </div>
      <form class="track-query-form">
        <input class="text_query track-query-input-text" type="text" placeholder="请输入车牌号" v-model="trackQueryCarId" >
        <input class="button_hover track-query-input-button" type="button" value="查询" @click="searchCarTable" />
        <input class="button_hover track-query-input-button" type="button" value="轨迹" @click="alertTrackModel" :disabled="trackAlertDisabled" />
      </form>
      <table style="height: 250px;">
        <thead><tr>
            <th>车牌号</th>
            <th>车型</th>
            <th>车速(km/h)</th>
            <th>位置</th>
        </tr></thead>
        <tbody style="height: 200px;">
          <tr v-for="data in carTableAfterFilter" @click="alertCarPosition(data.name)" class="no-select">
            <td>{{ data.name }}</td>
            <td>{{ data.cate }}</td>
            <td>{{ data.speed }}</td>
            <td>{{ data.location }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTrackStore} from "@/store/module/track.ts";
import {AlertCarEventBus} from "@/util/mitt.ts";
import {ref} from "vue";
import {storeToRefs} from "pinia";

// 轨迹查询模块状态库
const trackStore = useTrackStore();
const {carTableAfterFilter} = storeToRefs(trackStore);
// 轨迹查询指定车牌号
const trackQueryCarId = ref<string>('');
// 轨迹回放模式切换按钮禁止标志
const trackAlertDisabled = ref<boolean>(false);

/**
 * alertCarPosition()
 * (总线事务)点击轨迹查询列表中的车辆信息时,通知实时动画模块页面组件切换视角跟踪车辆
 * @param name 车牌号
 */
function alertCarPosition(name:string) {
  trackQueryCarId.value = name;
  AlertCarEventBus.emit('carName', name);
}

/**
 * alertTrackModel()
 * (总线事务)指定车辆信息后,切换为轨迹回放模式
 */
function alertTrackModel() {
  if (!trackQueryCarId.value) { return; }
  AlertCarEventBus.emit('model', {
    model: 1,
    name: trackQueryCarId.value,
    time: 'today',
    trajId: 0,
  });
}

/**
 * searchCarTable()
 * 点击查询按钮,根据输入内容模糊查询目标车辆信息
 */
function searchCarTable() {
  trackStore.updateFilterTrackList(trackQueryCarId.value);
}

/**
 * 总线事务-轨迹回放模式入口开关
 * Model模块根据目前所处的动画模式,控制模式的入口开关
 */
AlertCarEventBus.on('track', (flag) => {
  trackAlertDisabled.value = !flag;
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
