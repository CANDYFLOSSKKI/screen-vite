import {defineStore} from "pinia";
import {
    getLastedSecSpeedDataAPI,
    getSecInfoAPI,
    getTodaySecDataAPI,
    getSpecificDaySecDataAPI,
    getTimeRangeInfoAPI
} from "@/api/section.ts";
import {ref} from "vue";
import {HttpErrorData, SelectOption} from "@/model/index.ts";

import {httpErrorOutput} from "@/util/axios.ts";
import {SecInfoElem, SecQueryData, SecTimeRangeElem} from "@/model/module.ts";

export const useSectionStore = defineStore('section',() => {
    // 断面选择支
    const selectSecOptions = ref<Array<SelectOption>>([
        { label: 'K02+000', value: 2000 },
        { label: 'K03+500', value: 3500 },
        { label: 'K04+000', value: 4000 },
        { label: 'K04+500', value: 4500 },
    ]);
    // 断面时间选择支
    const selectTimeOptions = ref<Array<SelectOption>>([
        { label: '最近20分钟数据', value: 20 },
        { label: '最近40分钟数据', value: 40 },
        { label: '最近1小时数据', value: 60 },
        { label: '最近2小时数据', value: 120 },
    ]);

    // @ts-ignore
    function setDefaultSelectOptions() {
        clearSelectOptions();
        selectSecOptions.value = [
            { label: 'K02+000', value: 2000 },
            { label: 'K03+500', value: 3500 },
            { label: 'K04+000', value: 4000 },
            { label: 'K04+500', value: 4500 },
            { label: 'K05+200', value: 5200 },
            { label: 'K05+800', value: 5800 },
            { label: 'K08+000', value: 8000 },
            { label: 'K10+000', value: 10000 },
            { label: 'K12+000', value: 12000 },
            { label: 'K13+000', value: 13000 },
            { label: 'K13+700', value: 13700 }
        ];
        selectTimeOptions.value = [
            { label: '最近20分钟数据', value: 20 },
            { label: '最近40分钟数据', value: 40 },
            { label: '最近1小时数据', value: 60 },
            { label: '最近2小时数据', value: 120 },
        ];
    }
    function clearSelectOptions() {
        selectSecOptions.value = [];
        selectTimeOptions.value = [];
    }

    /**
     * getSecInfo()
     * 获取断面选择支信息
     */
    async function getSecInfo() {
        await getSecInfoAPI().then((res) => {
            const data = res as Array<SecInfoElem>;
            selectSecOptions.value = [];
            for (let elem of data) {
                selectSecOptions.value.push({
                    label: elem.xsecName,
                    value: elem.xsecValue,
                });
            }
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve();
    }

    /**
     * getTimeRangeInfo()
     * 获取断面时间选择支信息
     */
    async function getTimeRangeInfo() {
        await getTimeRangeInfoAPI().then((res) => {
            const data = res as Array<SecTimeRangeElem>;
            selectTimeOptions.value = [];
            for (let elem of data) {
                selectTimeOptions.value.push({
                    label: elem.timeRangeName,
                    value: elem.timeRangeValue
                });
            }
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve();
    }

    /**
     * getSelectOptions()
     * (合并任务)初始化断面/断面时间选择支信息
     */
    async function getSelectOptions() {
        return await Promise.all([getSecInfo(),getTimeRangeInfo()]);
    }

    /**
     * getTodaySecData()
     * 获取今日指定时间段内的断面数据信息
     * @param time 指定时间段
     */
    async function getTodaySecData(time:number):Promise<SecQueryData|undefined> {
        let data = undefined;
        await getTodaySecDataAPI(time).then((res) => {
            data = res as SecQueryData;
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(data);
    }

    /**
     * getSpecificDaySecData()
     * 获取指定日期指定时间段内的断面数据信息
     * @param date 指定日期
     * @param time 指定时间段
     */
    async function getSpecificDaySecData(date:string, time:number):Promise<SecQueryData|undefined> {
        let data = undefined;
         await getSpecificDaySecDataAPI(date,time).then((res) => {
             data = res as SecQueryData;
         }).catch((err) => {
             httpErrorOutput(err as HttpErrorData);
         })
        return Promise.resolve(data);
    }

    /**
     * getLastedSecData()
     * 实时断面速度模式下,获取最新断面数据信息
     */
    async function getLastedSecData():Promise<SecQueryData|undefined> {
        let data = undefined;
        await getLastedSecSpeedDataAPI().then((res) => {
            data = res as SecQueryData;
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve(data);
    }

    return {
        selectSecOptions,
        selectTimeOptions,
        getSelectOptions,
        getTodaySecData,
        getSpecificDaySecData,
        getLastedSecData,
    }
})
