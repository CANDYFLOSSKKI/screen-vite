import {defineStore} from "pinia";
import {ref} from "vue";
import Fuse from "fuse.js";
import {trackCarTableFuseOptions} from "@/util/fuse.ts";
import {CarTableData} from "@/model/module.ts";

// 轨迹查询模块状态库
export const useTrackStore = defineStore('track',() => {
    // 轨迹查询车辆列表
    const carTable = ref<Array<CarTableData>>([]);
    // 筛选后的轨迹查询车辆列表(动态变化)
    const carTableAfterFilter = ref<Array<CarTableData>>([]);

    function addToCarTable(data:CarTableData) {
        carTable.value.push(data);
    }
    function clearCarTable() {
        carTable.value = [];
    }
    function getCarTable() {
        return carTable.value;
    }
    function getCarTableNames() {
        return carTable.value.map(elem => elem.name);
    }

    /**
     * updateFilterTrackList()
     * 根据模糊查询车牌号,更新轨迹查询车辆列表
     * @param text 模糊查询目标字符串
     */
    function updateFilterTrackList(text?:string) {
        let fuse = new Fuse(carTable.value,trackCarTableFuseOptions);
        if (!text || text === '') {
            carTableAfterFilter.value = carTable.value;
        } else {
            carTableAfterFilter.value = fuse.search(text).map(result => result.item);
        }
    }

    return {
        carTable,
        carTableAfterFilter,
        addToCarTable,
        clearCarTable,
        getCarTable,
        getCarTableNames,
        updateFilterTrackList,
    }
})
