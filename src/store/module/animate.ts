import {defineStore} from "pinia"
import {ref} from "vue";
import {HttpErrorData, SelectOption} from "@/model/index.ts";
import {getCarDataByCarIdAPI, getCarDataByTimeAndTrajIdAPI, getRealTimeCarDataAPI} from "@/api/animate.ts";
import {httpErrorOutput} from "@/util/axios.ts";
import {CarTableData, RealTimeCarData, SpecificCarData, ViewModelData} from "@/model/module.ts";

export const useAnimateStore = defineStore('animate',() => {
    // 删除时需要保留的道路模型
    const reserveModelList = ref<Array<string>>([
        "road",
        "roadOnlySurface",
        "roadWithoutSurface",
    ]);
    // 需要计算车辆在这个道路模型的高度
    const calculateHeightModel = ref<string>("roadOnlySurface");
    // 判断系统是否第一次加载
    const flagInitial = ref<number>(0);
    // 回放数据标签数据存放在多个数组中
    const specialCarId = ref<any>([]);
    const specialLabel = ref<any>([]);
    const specialTime = ref<any>([]);
    // 存储上次获取数据的时间戳(防止时间回拨)
    const realTimeLast = ref<Date|undefined>(undefined);
    // 存储车辆上一次的高度
    const heightLast = ref<any>([]);
    // 存储车辆上一次的经度
    const longituteLast = ref<any>([]);
    // 存储车辆上一次的纬度
    const latitudeLast = ref<any>([]);
    // 获取高度时不采用这里面的模型高度
    const objectsToExclude = ref<any>([]);
    // 视角指定选择支
    const secSelectOptions = ref<Array<SelectOption>>([
        { label: 'K3+0(收费站)', value: 1 },
        { label: 'K5+800', value: 2 },
        { label: 'K9+150', value: 3 },
        { label: 'K11+200', value: 4 },
    ]);
    // 动画模式选择支
    const viewModelOptions = ref<Array<ViewModelData>>([
        { label: '实时动画模式', value: 0 },
        { label: '轨迹回放模式', value: 1 },
        { label: '历史回放模式', value: 2 },
    ]);

    function setInitial() {
        flagInitial.value = 1;
    }
    function getInitial() {
        return flagInitial.value === 0;
    }
    function resetInitial() {
        flagInitial.value = 0;
    }
    function getObjectToExclude() {
        return objectsToExclude.value;
    }
    function clearObjectToExclude() {
        objectsToExclude.value = [];
    }
    function addToObjectToExclude(entity:any) {
        objectsToExclude.value.push(entity);
    }
    function getReserveModelList() {
        return reserveModelList.value;
    }
    function getHeightLast(carName:string) {
        return heightLast.value[carName];
    }
    function getSecSelectOptionLabel(target:number) {
        return secSelectOptions.value.find(item => item.value === target)!.label;
    }
    function getViewModelOption(target:number) {
        return viewModelOptions.value.find(item => item.value === target)!;
    }

    /**
     * getRealTimeCarData()
     * 获取实时车辆数据
     */
    async function getRealTimeCarData():Promise<RealTimeCarData|undefined> {
        let data = undefined;
        await getRealTimeCarDataAPI().then((res) => {
            data = res as RealTimeCarData;
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(data);
    }

    /**
     * saveCarLastPosition()
     * 记录车辆模型最新的高度,经度,纬度信息
     * @param index 车牌号(key)
     * @param height 高度
     * @param longitude 经度
     * @param latitude 纬度
     */
    function saveCarLastPosition(index:string,height:number,longitude:number,latitude:number){
        heightLast.value[index] = height;
        longituteLast.value[index] = longitude;
        latitudeLast.value[index] = latitude;
    }

    /**
     * clearCarLastPosition()
     * 更新和清理车辆模型的高度,经度,纬度历史信息
     * @param carTable
     */
    function clearCarLastPosition(carTable:Array<CarTableData>) {
        let newHeightLast:any = [];
        let newLongituteLast:any = [];
        let newLatitudeLast:any = [];
        // 仅当车辆数据在轨迹查询中存在时,才会保存其数据
        for (let elem in heightLast.value) {
            for (let data of carTable) {
                if (elem === data.name) {
                    newHeightLast[elem] = heightLast.value[elem];
                    newLongituteLast[elem] = longituteLast.value[elem];
                    newLatitudeLast[elem] = latitudeLast.value[elem];
                }
            }
            heightLast.value = newHeightLast;
            longituteLast.value = newLongituteLast;
            latitudeLast.value = newLatitudeLast;
        }
    }

    /**
     * getCarDataByCarId()
     * 轨迹回放模式前置处理,根据车牌号获取车辆今日所有数据
     * @param id 指定的车牌号
     */
    async function getCarDataByCarId(id:string):Promise<SpecificCarData|undefined> {
        let result:SpecificCarData|undefined = undefined;
        await getCarDataByCarIdAPI(id).then((res) => {
            const data = res as SpecificCarData;
            if (data.count > 1) {
                result = data;
            }
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(result);
    }

    /**
     * getCarDataByTimeAndTrajId()
     * 历史回放模式前置处理,根据时间和轨迹号获取指定时间段前后的车辆数据
     * @param str 时间和轨迹号拼接的字符串(如2022-11-04_17:15:54_1667553332189)
     */
    async function getCarDataByTimeAndTrajId(str:string):Promise<SpecificCarData|undefined> {
        let result:SpecificCarData|undefined = undefined;
        await getCarDataByTimeAndTrajIdAPI(str).then((res) => {
            const data = res as SpecificCarData;
            if (data.count > 1) {
                result = data;
            }
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(result);
    }

    return {
        reserveModelList,
        calculateHeightModel,
        flagInitial,
        specialCarId,
        specialLabel,
        specialTime,
        heightLast,
        longituteLast,
        latitudeLast,
        objectsToExclude,
        getInitial,
        setInitial,
        saveCarLastPosition,
        getObjectToExclude,
        clearObjectToExclude,
        addToObjectToExclude,
        clearCarLastPosition,
        secSelectOptions,
        getSecSelectOptionLabel,
        getReserveModelList,
        getRealTimeCarData,
        resetInitial,
        viewModelOptions,
        realTimeLast,
        getHeightLast,
        getViewModelOption,
        getCarDataByCarId,
        getCarDataByTimeAndTrajId,
    }
})
