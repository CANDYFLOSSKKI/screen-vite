import {HttpErrorData} from "@/model/index.ts";
import {httpGet} from "@/util/axios.ts";
import {AccumulateCarNumberData} from "@/model/module.ts";

const enum API {
    GetAccumulateCar = '/getAccumulateCar',
}

/**
 * getAccumulateCarAPI()
 * 获取累计车辆数据信息
 * @return {Promise<AccumulateCarNumberData>} 成功时,返回累计车辆数据信息
 * @return {Promise<HttpErrorData>} 失败时,返回错误信息
 */
export async function getAccumulateCarAPI():Promise<AccumulateCarNumberData|HttpErrorData> {
    return await httpGet<AccumulateCarNumberData>(API.GetAccumulateCar);
}
