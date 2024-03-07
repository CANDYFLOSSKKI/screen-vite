import {defineStore} from "pinia";
import {getSpecificDayCarEventAPI, getTodayCarEventAPI} from "@/api/event.ts";
import {httpErrorOutput} from "@/util/axios.ts";
import {EventQueryData, EventQueryEntity} from "@/model/module.ts";
import {ref} from "vue";
import {HttpErrorData} from "@/model/index.ts";

export const useEventStore = defineStore('event',() => {
    // 车辆事件信息
    const carEventTable = ref<Array<EventQueryEntity>>([]);

    function clearCarEventTable() {
        carEventTable.value = [];
    }

    /**
     * addToCarEventTable()
     * 转换车辆信息中的时间(提取时分秒)后添加进列表中
     * @param entities
     */
    function addToCarEventTable(entities:Array<EventQueryEntity>) {
        clearCarEventTable();
        carEventTable.value = entities.map(event => {
            event.time = event.time.split('|')[1];
            return event;
        })
    }

    /**
     * getTodayCarEvent()
     * 获取今日的车辆事件信息
     */
    async function getTodayCarEvent() {
        let data = undefined;
        await getTodayCarEventAPI().then((res) => {
            data = res as EventQueryData;
            addToCarEventTable(data.entities);
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(data);
    }

    /**
     * getSpecificDayCarEvent()
     * 获取特定日期的车辆事件信息
     * @param date 指定日期
     */
    async function getSpecificDayCarEvent(date:string) {
        let data = undefined;
        await getSpecificDayCarEventAPI(date).then((res) => {
            data = res as EventQueryData;
            addToCarEventTable(data.entities);
        }).catch((err) => {
            httpErrorOutput(err);
        })
    }

    return {
        carEventTable,
        clearCarEventTable,
        getTodayCarEvent,
        getSpecificDayCarEvent,
    }
})
