import {httpGet} from "@/util/axios.ts";
import {HttpErrorData} from "@/model/index.ts";
import {SecInfoElem, SecQueryData, SecTimeRangeElem} from "@/model/module.ts";

const enum API {
    GetSecInfo = '/secInfo',
    GetTimeRangeInfo = '/timeRangeInfo',
    GetTodaySecData = '/secToday',
    GetSpecificDaySecData = '/secSpecificDay',
    GetLastedSecSpeed = '/lastedSecData',
}

/**
 * getSecInfoAPI()
 * 更新断面选择支信息
 * @return {Array<SecInfoElem>} 成功时,返回可选断面选择支信息
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getSecInfoAPI():Promise<Array<SecInfoElem>|HttpErrorData>{
    return await httpGet<Array<SecInfoElem>>(API.GetSecInfo);
}

/**
 * getTimeRangeInfoAPI()
 * 更新断面时间选择支信息
 * @return {Array<SecTimeRangeElem>} 成功时,返回可选断面时间选择支信息
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getTimeRangeInfoAPI():Promise<Array<SecTimeRangeElem>|HttpErrorData>{
    return await httpGet<Array<SecTimeRangeElem>>(API.GetTimeRangeInfo);
}

/**
 * getTodaySecDataAPI()
 * 获取当天指定时间内的断面数据
 * @param time 指定时间(以分钟为单位)
 * @return {SecQueryData} 成功时,返回断面数据
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getTodaySecDataAPI(time:number):Promise<SecQueryData|HttpErrorData>{
    return await httpGet<SecQueryData>(API.GetTodaySecData,
        {
            selectTime: time,
        }
    );
}

/**
 * getSpecificDaySecDataAPI()
 * 获取指定日期指定时间断面数据
 * @param date 指定日期(如2022-11-04)
 * @param time 指定时间(以分钟为单位)
 * @return {SecQueryData} 成功时,返回断面数据
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getSpecificDaySecDataAPI(date:string, time:number):Promise<SecQueryData|HttpErrorData>{
    return await httpGet<SecQueryData>(API.GetSpecificDaySecData,
        {
            date: date,
            selectTime: time,
        }
    );
}

/**
 * getLastedSecSpeedDataAPI()
 * 获取实时断面数据(适配实时断面速度查询模式)
 * @return {SecQueryData} 成功时,返回断面数据
 * @return {HttpErrorData} 失败时,返回错误信息
 */
export async function getLastedSecSpeedDataAPI():Promise<SecQueryData|HttpErrorData>{
    return await httpGet<SecQueryData>(API.GetLastedSecSpeed);
}
