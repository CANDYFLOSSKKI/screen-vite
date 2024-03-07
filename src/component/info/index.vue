<template>
  <!-- 重要数据模块页面组件 -->
  <div class="xpanel-wrapper xpanel-wrapper-25">
    <div class="xpanel xpanel-r-t" id='important'>
      <div class="title"><i class="important-info-title">重要数据</i></div>
      <p class="text">武鄂方向累积车辆：<span class="important-info-text">{{ leftCarSum }}</span></p>
      <p class="text">鄂武方向累积车辆：<span class="important-info-text">{{ rightCarSum }}</span></p>
      <p class="text">武鄂方向在途车辆：<span class="important-info-text">{{ leftCarCount }}</span></p>
      <p class="text">鄂武方向在途车辆：<span class="important-info-text">{{ rightCarCount }}</span></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useInfoStore} from "@/store/module/info.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";

// 重要数据模块状态库
const infoStore = useInfoStore();
const {leftCarSum,rightCarSum,leftCarCount,rightCarCount} = storeToRefs(infoStore);

onMounted(() => {
  infoStore.clearCarSum();
  infoStore.clearCarCount();
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
