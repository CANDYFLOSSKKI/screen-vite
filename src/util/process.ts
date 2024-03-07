import * as Cesium from 'cesium';
import {RealTimeCarEntity, SecQueryEntity} from "@/model/module.ts";
import {DATE_JULIAN_OFFSET_HOURS} from "@/static/cesium.ts";
import {HttpRequestMethod} from "@/model/index.ts";

/**
 * parseStrToDate()
 * 转换API返回的车辆时间字符串为Date类型
 * 随着API返回日期格式的改变,内部逻辑也需要调整
 * @param date 车辆时间字符串
 */
export function parseStrToDate(date:string) {
    if (date.includes("|")) {
        let pStr_date = date.split("|")[0].split("-").map(Number);
        let pStr_time = date.split("|")[1].split(":").map(Number);
        return new Date(pStr_date[0], pStr_date[1]-1, pStr_date[2], ...pStr_time);
    }
    let pStr_date = date.split("-").map(Number);
    return new Date(pStr_date[0], pStr_date[1]-1, pStr_date[2]);
}

/**
 * parseStrToHttpMethod()
 * 转换请求方式字符串为对应的HttpRequestMethod枚举成员
 * @param str 请求方式字符串(get/post)
 */
export function parseStrToHttpMethod(str:string):HttpRequestMethod {
    return str === 'get' ?
        HttpRequestMethod.GET :
        HttpRequestMethod.POST;
}

/**
 * parseDateToJulian()
 * 时间信息转Cesium系统时钟时间
 * @param date 时间信息
 * @param offset 时间偏移量
 */
export function parseDateToJulian(date:Date, offset?:number) {
    let time = Cesium.JulianDate.addHours(
        Cesium.JulianDate.fromDate(date),
        DATE_JULIAN_OFFSET_HOURS,
        new Cesium.JulianDate()
    );
    return Cesium.JulianDate.addSeconds(time,offset ? offset : 0,new Cesium.JulianDate);
}

/**
 * splitTimeSpan()
 * 处理给定的起止时间戳,将其分为指定数量的等分时间点
 * @param timeStart 起始时间
 * @param timeEnd 终止时间
 * @param count 需要分割的目标时间点数量
 */
export function splitTimeSpan(timeStart:string, timeEnd:string, count:number) {
    const dateStart = parseStrToDate(timeStart);
    const dateEnd = parseStrToDate(timeEnd);
    let dates:Array<Date> = [];
    // 等分时间点数量少于3个为异常情况,直接输出起止时间即可
    if (count < 3) {
        dates.push(dateStart);
        dates.push(dateEnd);
    } else {
        let interval:number = (dateEnd.getTime()-dateStart.getTime()) / (count - 1);
        for (let i = 0; i < count - 1; i++) {
            let current = new Date();
            current.setTime(dateStart.getTime() + i * interval);
            dates.push(current);
        }
        dates.push(dateEnd);
    }
    return dates;
}

/**
 * secTableDataSortByDate()
 * 比较断面数据按时间的先后排序
 * @param i 排序数据1(i靠前时应该返回负数)
 * @param j 排序数据2(j靠前时应该返回正数)
 */
export function secTableDataSortByDate(i:SecQueryEntity, j:SecQueryEntity):number {
    let iDate = parseStrToDate(i.time);
    let jDate = parseStrToDate(j.time);
    return iDate < jDate ? -1 : 1;
}

/**
 * carSpeedSortByPosition()
 * 在轨迹回放模式/历史回放模式下,比较车辆速度数据按断面位置排序
 * @param i 排序数据1(i靠前时应该返回负数)
 * @param j 排序数据2(j靠前时应该返回正数)
 */
export function carSpeedSortByPosition(i:RealTimeCarEntity,j:RealTimeCarEntity):number {
    const regex = /\d/;
    let [iSecStr, iSecOffset] = [i.location.split("+")[0],i.location.split("+")[1]];
    let [jSecStr, jSecOffset] = [j.location.split("+")[0],j.location.split("+")[1]];
    let iSecNum = Number(iSecStr.substring(iSecStr.match(regex)!.index!));
    let jSecNum = Number(jSecStr.substring(jSecStr.match(regex)!.index!));
    if (iSecNum != jSecNum) {
        return iSecNum < jSecNum ? -1 : 1;
    }
    return Number(iSecOffset) < Number(jSecOffset) ? -1 : 1;
}

/**
 * alertInfo()
 * 系统向用户的提示信息处理
 * @param msg 待输出的目标信息
 */
export function alertInfo(msg:string) {
    console.log(msg);
}
