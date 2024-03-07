import {httpGet} from "@/util/axios.ts";
import {HttpErrorData} from "@/model/index.ts";
import {DeviceData} from "@/model/module.ts";

const enum API {
    GetRadarDevice = '/radarDevice',
    GetLicenseDevice = '/licenseDevice',
}

/**
 * getRadarDeviceAPI()
 * (GET)获取雷达设备信息
 * @return {Promise<DeviceData>} 成功时,返回雷达设备信息
 * @return {Promise<HttpErrorData>} 失败时,返回错误信息
 */
export async function getRadarDeviceAPI():Promise<DeviceData|HttpErrorData> {
    return await httpGet<DeviceData>(API.GetRadarDevice);
}

/**
 * getLicenseDeviceAPI()
 * (GET)获取牌照设备信息
 * @return {Promise<DeviceData>} 成功时,返回牌照设备信息
 * @return {Promise<HttpErrorData>} 失败时,返回错误信息
 */
export async function getLicenseDeviceAPI():Promise<DeviceData|HttpErrorData> {
    return await httpGet<DeviceData>(API.GetLicenseDevice);
}
