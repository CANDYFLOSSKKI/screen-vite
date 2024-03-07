<template>
  <!-- 实时动画模块页面组件 -->
  <div id="ViewModel" style="width:60% ;float: left;">
    <span class="view-model-title">{{ viewModel.label }}</span>
    <input type="button" class="button_hover track-query-input-button view-model-switch" value="返回" :disabled="returnToCurrentModelDisabled" @click="returnToCurrentModel" />
    <input type="button" class="view-model-show" :value="viewInfo"/>
  </div>
  <div class="view-model-position">
    <!--
      视角指定:
      不同的选择项对应不同的视角位置
      进入车辆轨迹跟踪模式时会自动切换到值为5的选项(手动无法选择)
    -->
    <select name="sectionDropdownList" class="view-model-position-select" id="viewPosition" @change="selectSectionViewFly" v-model="selectSec">
      <option v-for="option in secSelectOptions" :value="option.value">{{ option.label }}</option>
    </select>
    <input type="button" value="武汉-->鄂州" class="view-model-position-input" @click="selectSectionViewFly">
  </div>
  <div class="xpanel-wrapper xpanel-wrapper-70">
    <div class="xpanel no-bg cesium-container-outer" id="cesiumContainer">
      <!-- 轨迹回放模式/历史回放模式中车辆的位置速度变化表 -->
      <v-chart class="cesium-container-inner" :option="eChartsModelSpeedData" v-if="carModelEChartsShow"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from "cesium";
import {computed, onMounted, ref} from "vue";
import {parseStrToDate, parseDateToJulian, splitTimeSpan, carSpeedSortByPosition, alertInfo} from "@/util/process.ts";
import {useInfoStore} from "@/store/module/info.ts";
import {useAnimateStore} from "@/store/module/animate.ts";
import {useTrackStore} from "@/store/module/track.ts";
import {storeToRefs} from "pinia";
import "echarts";
import VChart from "vue-echarts";
import {
  ACCESS_TOKEN,
  DEFAULT_ENDTIME,
  MAX_HEIGHT_DIFFERENCE,
  DEFAULT_CAMERA_POSITION,
  DEFAULT_CAMERA_ORIENTATION,
  INITIAL_CAMERA_ORIENTATION,
  INITIAL_CAMERA_POSITION,
  ROAD_POSITION,
  ROAD_ORIENTATION,
  DEFAULT_CAR_CATE,
  DEFAULT_LABEL_COLOR,
  DEFAULT_LABEL_DISTANCE,
  DEFAULT_LABEL_EYEOFFSET,
  DEFAULT_TRACK_POSITION,
  MAX_COORDINATE_DIFFERENCE,
} from "@/static/cesium.ts";
import {AlertCarEventBus} from "@/util/mitt.ts";
import {eChartsModelSpeedData} from "@/static/echarts.ts";
import {resetCount} from "@/api/animate.ts";
import {ModelSwitchData, RealTimeCarEntity, SpecificCarData, ViewModelData} from "@/model/module.ts";
import {REALTIME_FLUSH_INTERVAL} from "@/static/interval.ts";

// 重要信息模块状态库
const infoStore = useInfoStore();
// 轨迹查询模块状态库
const trackStore = useTrackStore();
// 实时动画模块状态库
const modelStore = useAnimateStore();
const {calculateHeightModel,secSelectOptions,realTimeLast} = storeToRefs(modelStore);
// Cesium组件Token与基本容器
Cesium.Ion.defaultAccessToken = ACCESS_TOKEN;
const viewer = ref<Cesium.Viewer>();
const scene = ref<Cesium.Scene>();
// 实时动画模式时钟起始值记录
const startClock = ref<Cesium.JulianDate>();
// 获取实时车辆数据的定时任务ID
const updateRealTimeRoadDataTimer = ref<number|undefined>(undefined);
// 视角指定选择项
const selectSec = ref<number>(1);
// 当前动画模式选择项
const viewModel = ref<ViewModelData>({
  label: '实时动画模式',
  value: 0,
});
// 当前动画模式信息值
const viewInfo = ref<string>('实时动画模式');
// 返回实时动画模式按钮禁止标志位
const returnToCurrentModelDisabled = computed(() => {
  return viewModel.value.value === 0;
})
// 车辆位置速度表显示控制标志位
const carModelEChartsShow = ref<boolean>(false);

/**
 * initCesiumFramework()
 * 初始化Cesium组件,路面与路面装饰,视角等信息
 */
async function initCesiumFramework(){
  viewer.value = new Cesium.Viewer("cesiumContainer",{
    shouldAnimate: true,
    selectionIndicator: true,
    infoBox: true,
  });
  scene.value = viewer.value!.scene;
  scene.value!.globe.depthTestAgainstTerrain = true;
  viewer.value!.entities.removeAll();
  let position = new Cesium.Cartesian3(...ROAD_POSITION);
  let orientation = Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(...ROAD_ORIENTATION));
  // 初始化路面模型(路面模型是所有添加的车辆模型计算位置时的基准)
  viewer.value!.entities.add({
    id: "roadOnlySurface",
    position: position,
    orientation: orientation as any as Cesium.Property,
    model: { uri: '/model/highway/roadOnlySurface.glb' },
  });
  // 初始化路面装饰(和路面模型的位置重合)
  viewer.value!.entities.add({
    id: "roadWithoutSurface",
    position: position,
    orientation: orientation as any as Cesium.Property,
    model: { uri: '/model/highway/roadWithoutSurface.glb' },
  });
  // 初始化视角到高速收费站
  scene.value!.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...INITIAL_CAMERA_POSITION),
    orientation: INITIAL_CAMERA_ORIENTATION,
  })
}

/**
 * addScreenClickEventHandler()
 * 添加点击窗口返回目标位置方位信息的响应事件
 */
function addScreenClickEventHandler() {
  let canvas = viewer.value!.scene.canvas;
  let handler = new Cesium.ScreenSpaceEventHandler(canvas);
  handler.setInputAction( function (lclickment:any) {
    let ellipsoid = scene.value!.globe.ellipsoid;
    let cartesian = viewer.value!.scene.pickPosition(lclickment.position);
    let camera = viewer.value!.camera;
    if (cartesian) {
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);  // 精度
      let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);   // 纬度
      let height = camera.positionCartographic.height.toFixed(0);          // 视角高度
      let heading = Cesium.Math.toDegrees(camera.heading).toFixed(2);      // 围绕Z轴旋转
      let pitch = Cesium.Math.toDegrees(camera.pitch).toFixed(2);          // 围绕Y轴旋转
      let roll = Cesium.Math.toDegrees(camera.roll).toFixed(2);            // 围绕X轴旋转
      alertInfo(`当前点击位置与视角高度信息:\nlon:\t\t${lon}\nlat:\t\t${lat}\nheight:\t\t${height}\nheading:\t${heading}\npitch:\t\t${pitch}\nroll:\t\t${roll}`);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * updateRealTimeRoadData()
 * 获取实时车辆数据并更新车辆相关数据和模型信息
 */
async function updateRealTimeRoadData() {
  const data = await modelStore.getRealTimeCarData();
  if (!data) { return; }
  // 首次更新车辆数据时初始化参数
  initCesiumTimeParams(data.timeStamp);
  const realTime = parseStrToDate(data.timeStamp);
  if (!validateRealTimeStamp(realTime)) { return; }
  batchClearCarData();
  // 更新目前在途车辆数目(该函数会后续更新累计车辆数目)
  await infoStore.updateInfo(data.leftCarCount,data.rightCarCount);
  for (let elem of data.entities) {
    // 更新车辆轨迹列表信息
    updateCarTable(elem);
    // 更新车辆模型列表信息
    updateCarEntity(elem);
    // 更新车辆位置(高度和方位角)信息
    updateCarPosition(elem,realTime);
  }
  // 更新轨迹查询车辆筛选列表
  trackStore.updateFilterTrackList();
  // (后处理)检查已添加的车辆模型是否最新
  clearCarEntities();
  // (后处理)更新计算高度时不参与参考的模型信息
  clearObjectsToExclude();
  // (后处理)更新车辆模型的历史高度,经度,纬度信息
  clearCarLastPosition();
}

/**
 * batchClearCarData()
 * 批量清空车辆轨迹信息,以及车辆数据的统计信息
 */
function batchClearCarData() {
  trackStore.clearCarTable();
  infoStore.clearCarCount();
  infoStore.clearCarSum();
}

/**
 * initCesiumTimeParams()
 * 首次更新车辆数据时初始化参数
 * @param timeStart 时间戳信息(用于校准时钟)
 * @param timeEnd (轨迹回放模式/历史回放模式专有)时间线的终止时间
 */
function initCesiumTimeParams(timeStart:string, timeEnd?:string) {
  if (!modelStore.getInitial()) { return; }
  modelStore.setInitial();
  startClock.value = parseDateToJulian(parseStrToDate(timeStart));
  let baseClock = parseDateToJulian(parseStrToDate(timeStart));
  // 轨迹回放模式/历史回放模式下会传入timeEnd,在初始化时钟阶段就确定终止时间
  let stopClock = timeEnd ?
      parseDateToJulian(parseStrToDate(timeEnd!)) :
      Cesium.JulianDate.addSeconds(baseClock,DEFAULT_ENDTIME,new Cesium.JulianDate);
  viewer.value!.clock.startTime = startClock.value;
  viewer.value!.clock.stopTime = stopClock.clone();
  viewer.value!.clock.currentTime = startClock.value;
  viewer.value!.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
  viewer.value!.timeline.zoomTo(startClock.value.clone(),stopClock.clone());
}

/**
 * validateRealTimeStamp()
 * 判断本次实时车辆数据时间戳是否有效
 * @param realTime 车辆数据时间
 */
function validateRealTimeStamp(realTime:Date):boolean {
  if (!realTimeLast.value) {
    realTimeLast.value = realTime;
    return true;
  }
  // 时间上不能小于等于上次传入的实时车辆数据时间戳
  if (realTime.getTime() <= realTimeLast.value.getTime()) {
    return false;
  }
  // 校准动画时钟和时间线终止时间
  const realTimeJulian = parseDateToJulian(realTime);
  viewer.value!.clock.stopTime = realTimeJulian.clone();
  viewer.value!.timeline.zoomTo(startClock.value!,realTimeJulian.clone());
  realTimeLast.value = realTime;
  return true;
}

/**
 * updateCarTable()
 * 更新车辆轨迹列表信息
 */
function updateCarTable(elem:RealTimeCarEntity) {
  // 向轨迹查询列表添加车辆信息
  trackStore.addToCarTable({
    name: elem.carNumber,
    cate: DEFAULT_CAR_CATE,
    speed: String(elem.speed),
    location: elem.location,
  });
}

/**
 * updateCarEntity()
 * 更新车辆模型列表信息
 */
function updateCarEntity(elem:RealTimeCarEntity) {
  if (viewer.value!.entities.getById(elem.carNumber)) { return; }
  // 添加新的车辆模型信息(位置和方向角信息在updatePosition()中确定)
  viewer.value!.entities.add({
    id: elem.carNumber,
    position: new Cesium.SampledPositionProperty(),
    model: {
      uri: '/model/vehicle/_Subaru-Loyale.glb',
      // uri: "/model/vehicle/cartest/xianghuo.glb",
      // uri: "/model/vehicle/changhuoche.glb",
      runAnimations: true,
    },
    label: {
      text: `${elem.carNumber}\n${elem.speed}km/h`,
      font: '20px sans-serif',
      backgroundColor: Cesium.Color.fromBytes(...DEFAULT_LABEL_COLOR),
      showBackground: true,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(...DEFAULT_LABEL_DISTANCE),
      eyeOffset: new Cesium.Cartesian3(...DEFAULT_LABEL_EYEOFFSET),
    },
  });
}

/**
 * updateCarPosition()
 * 更新车辆模型位置(高度和方位角)信息
 */
function updateCarPosition(elem:RealTimeCarEntity, date:Date) {
  // 获取校正后的车辆模型高度信息
  let height = carRealTimeHeightHandler(elem);
  let position = Cesium.Cartesian3.fromDegrees(elem.position[0],elem.position[1],height);
  // 向状态库存储最新的车辆模型位置信息
  modelStore.saveCarLastPosition(elem.carNumber,height,elem.position[0],elem.position[1]);
  // 设置Cesium车辆模型位置信息
  (<Cesium.SampledPositionProperty>viewer.value!.entities.getById(elem.carNumber)!.position).addSample(parseDateToJulian(date),position);
  viewer.value!.entities.getById(elem.carNumber)!.orientation = new Cesium.VelocityOrientationProperty(viewer.value!.entities.getById(elem.carNumber)!.position);
  viewer.value!.entities.getById(elem.carNumber)!.label!.text = (`${elem.carNumber}\n${elem.speed}km/h`) as any as Cesium.Property;
}

/**
 * carRealTimeHeightHandler()
 * 获取校正后的车辆模型高度信息(处理高度跳变)
 * @param elem 实时车辆信息
 */
function carRealTimeHeightHandler(elem:RealTimeCarEntity):number {
  // 经纬度转模型高度(高度基准是初始化时添加的道路路面模型)
  let height = carCoordinateToHeight(elem.position[0], elem.position[1]);
  let foreHeight = modelStore.getHeightLast(elem.carNumber);
  let resetFlag:boolean = true;
  // 比较本次高度和上次高度的高度差
  // 超过能容忍的两次数据高度差最大值时沿用上次高度;速度为0但发生高度跳变时也沿用上次高度
  if (Cesium.defined(foreHeight)){
    let heightDifference = (height - foreHeight);
    if (heightDifference > MAX_HEIGHT_DIFFERENCE) {
      alertInfo(`${elem.carNumber}本次高度: ${height},上次高度：${foreHeight},发生高度跳变: ${heightDifference}米,沿用上次高度`);
    } else if (heightDifference === 0) {
      alertInfo(`${elem.carNumber}本次高度: ${height},上次高度: ${foreHeight},未发生高度跳变`);
    } else {
      alertInfo(`${elem.carNumber}本次高度: ${height},上次高度: ${foreHeight},发生高度跳变: ${heightDifference}米,当前速度: ${elem.speed}km/h`);
      resetFlag = elem.speed === 0;
    }
    // 重置或保持当前计算高度值
    height = resetFlag ? foreHeight : height;
  } else {
    alertInfo(`${elem.carNumber}本次高度: ${height},上次高度未定义`);
  }
  return height;
}

/**
 * carCoordinateToHeight()
 * 根据车辆模型的经纬度获取高度(高度基准是初始化时添加的道路路面模型)
 * @param longitude 经度
 * @param latitude 纬度
 */
function carCoordinateToHeight(longitude:number, latitude:number):number {
  // 当车辆模型原始位置不在路面上时,按照经纬度差值查找东南西北四个方向的位置代替
  let adjacentPositions:Array<[string,number,number]> = [
      ['沿用车辆模型原始高度位置: ', longitude, latitude],
      ['沿用车辆模型南侧高度位置: ', longitude, latitude - MAX_COORDINATE_DIFFERENCE],
      ['沿用车辆模型北侧高度位置: ', longitude, latitude + MAX_COORDINATE_DIFFERENCE],
      ['沿用车辆模型西侧高度位置: ', longitude - MAX_COORDINATE_DIFFERENCE, latitude],
      ['沿用车辆模型东侧高度位置: ', longitude + MAX_COORDINATE_DIFFERENCE, latitude],
  ];
  for (let position of adjacentPositions) {
    let cartographic = Cesium.Cartographic.fromDegrees(position[1],position[2],0);
    let height = scene.value!.sampleHeight(cartographic, modelStore.getObjectToExclude());
    if (Cesium.defined(height) && height > 0) {
      alertInfo(`${position[0]}${height}\n经纬度为: (${longitude},${latitude})`);
      return height;
    }
  }
  alertInfo(`获取高度失败,默认高度: 0\n经纬度为: (${longitude},${latitude})`);
  return 0.0;
}

/**
 * selectSectionViewFly()
 * 视角指定发生改变时,跳转到对应的视角位置
 */
function selectSectionViewFly() {
  viewInfo.value = viewModel.value.label;
  alertInfo(`视角位置跳转: ${modelStore.getSecSelectOptionLabel(selectSec.value)}`);
  viewer.value!.trackedEntity = undefined;
  scene.value!.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...DEFAULT_CAMERA_POSITION[selectSec.value-1]),
    orientation: DEFAULT_CAMERA_ORIENTATION,
  });
}

/**
 * clearCarEntities()
 * 更新和清理Cesium中已添加的车辆模型信息
 */
function clearCarEntities() {
  let entities = viewer.value!.entities.values;
  for (let ent of entities) {
    // 检测目标模型是否在轨迹查询列表中
    if (trackStore.getCarTable().map(i => i.name).includes(ent.id)) { continue; }
    // 当目标模型不在轨迹查询列表中时,检测是否属于删除时需要保留的模型(即不属于车辆模型)
    if (modelStore.getReserveModelList().includes(ent.id)) { continue; }
    // 删除不在轨迹查询列表中的车辆模型
    alertInfo(`清除历史车辆: ${ent.id}`);
    viewer.value!.entities.remove(ent);
  }
}

/**
 * clearObjectsToExclude()
 * 更新和清理计算高度时不参与参考的模型信息
 * 除了路面模型(即calculateHeightModel)是sampleHeight()的高度基准之外,其他的模型均不参与高度计算
 */
function clearObjectsToExclude() {
  modelStore.clearObjectToExclude();
  for (let elem of viewer.value!.entities.values) {
    if (elem.id != calculateHeightModel.value) {
      // 排除在外的模型移动至排除列表中,下次校正高度时作为参数传入sampleHeight()
      modelStore.addToObjectToExclude(elem);
    }
  }
}

/**
 * clearCarLastPosition()
 * 更新和清理车辆模型的历史高度,经度,纬度信息
 */
function clearCarLastPosition() {
  modelStore.clearCarLastPosition(trackStore.getCarTable());
}

/**
 * trackCarModel()
 * 切换视角聚焦到指定的车牌号对应的模型
 * @param name 指定的车牌号
 */
function trackCarModel(name:string) {
  let ent = viewer.value!.entities.getById(name as string);
  if (!ent) { return; }
  viewInfo.value = `${ent.id} ${realTimeLast.value!.toISOString().split('T')[0]}`;
  viewer.value!.trackedEntity = ent;
  ent.viewFrom = new Cesium.Cartesian3(...DEFAULT_TRACK_POSITION) as any as Cesium.Property;
}

/**
 * updateCarSpeedEChartsData()
 * 更新车辆位置速度变化表
 * @param entities 车辆数据信息
 */
function updateCarSpeedEChartsData(entities:Array<RealTimeCarEntity>) {
  entities.sort(carSpeedSortByPosition);
  eChartsModelSpeedData.value.xAxis.data = entities.map(elem => elem.location);
  eChartsModelSpeedData.value.series[0].data = entities.map(elem => elem.speed);
}

/**
 * switchToTrackModel()
 * 切换到轨迹回放模式的处理逻辑
 * @param data 动画模式切换的交互数据
 */
async function switchToTrackModel(data:ModelSwitchData) {
  // 获取指定车辆当天的所有数据,没有获取到,或者是数据量只有一个时都不会继续
  const res = await modelStore.getCarDataByCarId(data.name);
  if (!res) { return; }
  // 禁止轨迹查询按钮再次发起请求
  switchModelEntryNotify(false);
  // 修改回放模式相关的信息
  viewModel.value = modelStore.getViewModelOption(data.model);
  switchModelGeneralProcess(res);
  // 视角聚焦到目标车辆
  trackCarModel(data.name);
}

/**
 * switchToHistoryModel()
 * 切换到历史回放模式的处理逻辑
 * @param data 动画模式切换的交互数据
 */
async function switchToHistoryModel(data:ModelSwitchData) {
  const res = await modelStore.getCarDataByTimeAndTrajId(`${data.time}_${data.trajId}`);
  if (!res) { return; }
  // 禁止事件模块再次发起请求
  switchModelEntryNotify(false);
  // 修改回放模式相关的信息
  viewModel.value = modelStore.getViewModelOption(data.model);
  switchModelGeneralProcess(res);
  // 视角聚焦到目标车辆
  trackCarModel(data.name);
}

/**
 * switchModelGeneralProcess()
 * 转为轨迹回放模式/历史回放模式时的通用处理逻辑(根据需求变化可能后续作拆分处理)
 * @param res 特定的车辆数据
 */
function switchModelGeneralProcess(res:SpecificCarData) {
  // 清空实时动画模式更新的定时任务(已更新的数据保持不变)
  clearInterval(updateRealTimeRoadDataTimer.value);
  // 重置实时动画模式的初始化标志
  modelStore.resetInitial();
  selectSec.value = 1;
  // 清除路面上已添加的所有车辆信息
  for (let id of trackStore.getCarTableNames()) {
    viewer.value!.entities.removeById(id);
  }
  // 重置系统时钟和动画时间线,适配该指定车辆数据的起止时间
  initCesiumTimeParams(res.timeStart,res.timeEnd);
  // 添加车辆模型以及每个等分时间点上的高度和方位信息
  const dateData = splitTimeSpan(res.timeStart,res.timeEnd,res.entities.length);
  for (let i = 0; i < res.entities.length; i++) {
    updateCarEntity(res.entities[i]);
    updateCarPosition(res.entities[i],dateData[i]);
  }
  // 更新车辆速度表
  updateCarSpeedEChartsData(res.entities);
  carModelEChartsShow.value = true;
  realTimeLast.value = parseStrToDate(res.timeStart);
}

/**
 * switchModelEntryNotify()
 * 进行动画模式切换时,通知Track和Event模块是否可以进入轨迹回放模式/历史回放模式
 * @param flag 动画模式切换使能标志位
 */
function switchModelEntryNotify(flag:boolean) {
  AlertCarEventBus.emit('event',flag);
  AlertCarEventBus.emit('track',flag);
}

/**
 * returnToCurrentModel()
 * 由轨迹回放模式/历史回放模式退回实时动画模式的处理逻辑
 */
async function returnToCurrentModel() {
  // 隐藏车辆速度变化表
  carModelEChartsShow.value = false;
  // 重置动画模式信息,断面选择项和视角
  viewModel.value = modelStore.getViewModelOption(0);
  selectSec.value = 1;
  selectSectionViewFly();
  // 清除路面上所有车辆(可以优化为只清除传参车辆提高性能)
  for (let elem of viewer.value!.entities.values) {
    if (!modelStore.getReserveModelList().includes(elem.id)) {
      viewer.value!.entities.remove(elem);
    }
  }
  // 重置实时动画模式的初始化标志
  modelStore.resetInitial();
  realTimeLast.value = undefined;
  resetCount();
  // 重新获取实时车辆数据
  await updateRealTimeRoadData();
  setTimelyTask();
  // 轨迹回放/历史回放模式重新使能
  switchModelEntryNotify(true);
}

function setTimelyTask() {
  updateRealTimeRoadDataTimer.value = window.setInterval(updateRealTimeRoadData, REALTIME_FLUSH_INTERVAL);
}

/**
 * 总线事务-车辆聚焦
 */
AlertCarEventBus.on('carName', (name) => {
  if (viewModel.value.value === 0) {
    trackCarModel(<string>name);
  }
});

/**
 * 总线事务-动画模式切换
 */
AlertCarEventBus.on('model',async (data) => {
  const modelData = data as ModelSwitchData;
  if (modelData.model === 1) {
    await switchToTrackModel(modelData);
  } else {
    await switchToHistoryModel(modelData);
  }
})


onMounted(() => {
  batchClearCarData();
  initCesiumFramework();
  // Cesium渲染完成前校正车辆模型的高度和方位角会发生错误(undefined)
  // LOAD_TIMEOUT静态属性值可根据性能和网络环境灵活调整
  setTimeout(() => {
    addScreenClickEventHandler();
    updateRealTimeRoadData();
    setTimelyTask();
  },REALTIME_FLUSH_INTERVAL);
})

</script>

<style scoped>
@import "@/css/app.css";
@import "@/css/style.css";
</style>
