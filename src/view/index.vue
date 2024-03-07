<template>
  <div class="index-body">
    <div class="header">
      <h1 class="header-title">{{ pageTitle }}</h1>
    </div>
    <div class="wrapper">
      <div class="content">
        <div class="col col-l">
          <!--轨迹查询页面组件-->
          <track-query />
          <!-- 断面流量分析页面组件 -->
          <section-flow />
        </div>
        <div class="col col-c">
          <!-- 实时动画页面组件 -->
          <animate-view />
          <!-- 断面速度分析页面组件 -->
          <section-speed />
        </div>
        <div class="col col-r">
          <!-- 重要数据页面组件 -->
          <important-info />
          <!-- 设备管理页面组件 -->
          <device-manage />
          <!-- 事件预警页面组件 -->
          <event-warning />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackQuery from "@/component/track/index.vue";
import SectionFlow from "@/component/section/flow/index.vue";
import AnimateView from "@/component/animate/index.vue";
import SectionSpeed from "@/component/section/speed/index.vue";
import ImportantInfo from "@/component/info/index.vue";
import DeviceManage from "@/component/device/index.vue";
import EventWarning from "@/component/event/index.vue";
import {onMounted} from "vue";
import {resetCount} from "@/api/animate.ts";
const pageTitle = import.meta.env.VITE_PAGE_TITLE;
onMounted(() => {
  resetCount();
})
</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
