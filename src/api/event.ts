import {HttpErrorData} from "@/model/index.ts";
import {httpGet} from "@/util/axios.ts";
import {EventQueryData} from "@/model/module.ts";

const enum API {
    GetTodayCarEvent = '/carEventToday',
    GetSpecificDayCarEvent = '/carEventSpecificDay',
}

/**
 * getTodayCarEventAPI()
 * 获取今日车辆事件信息数据
 * @return {EventQueryData} 成功时,返回车辆事件数据
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getTodayCarEventAPI():Promise<EventQueryData|HttpErrorData> {
    return await httpGet<EventQueryData>(API.GetTodayCarEvent);
}

/**
 * getSpecificDayCarEventAPI()
 * 获取特定日期车辆事件信息数据
 * @param date 指定日期(如2022-11-04)
 * @return {EventQueryData} 成功时,返回车辆事件数据
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getSpecificDayCarEventAPI(date:string):Promise<EventQueryData|HttpErrorData> {
    return await httpGet<EventQueryData>(API.GetSpecificDayCarEvent, {
        date: date,
    });
}
