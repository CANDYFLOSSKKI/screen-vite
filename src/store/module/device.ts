import {defineStore} from "pinia";
import {ref} from "vue";
import {getLicenseDeviceAPI, getRadarDeviceAPI} from "@/api/device.ts";
import {HttpErrorData} from "@/model/index.ts";
import {httpErrorOutput} from "@/util/axios.ts";
import {DeviceData, DeviceTableData} from "@/model/module.ts";

export const useDeviceStore = defineStore('device',() => {
    // 设备信息表
    const deviceTable = ref<Array<DeviceTableData>>([]);
    // 总设备数量
    const deviceAllCount = ref<number>(0);
    // 在线设备数量
    const deviceOnStateCount = ref<number>(0);

    /**
     * clearDeviceTable()
     * 清空设备信息表和设备数量信息
     */
    function clearDeviceTable() {
        deviceTable.value = [];
        deviceAllCount.value = 0;
        deviceOnStateCount.value = 0;
    }

    /**
     * updateDeviceTable()
     * 更新设备信息表和设备数量信息
     * @param data 新获取的指定类型设备信息
     */
    function updateDeviceTable(data:DeviceData) {
        clearDeviceTable();
        for (let ent of data.entities) {
            deviceTable.value.push({
                deviceId: ent.deviceId,
                loc: ent.location ?? '暂无',
                roadDirect: ent.roadDirect,
                state: ent.state,
            });
        }
        deviceAllCount.value = data.count;
        deviceOnStateCount.value = data.onState;
    }

    /**
     * getRadarDeviceData()
     * 获取雷达设备信息
     * 请求成功时同步更新设备状态库;请求失败时输出错误信息
     */
    async function getRadarDeviceData() {
        await getRadarDeviceAPI().then((res) => {
            const data = res as DeviceData;
            updateDeviceTable(data);
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve();
    }

    /**
     * getLicenseDeviceData()
     * 获取牌照设备信息
     * 请求成功时同步更新设备状态库;请求失败时输出错误信息
     */
    async function getLicenseDeviceData() {
        await getLicenseDeviceAPI().then((res) => {
            const data = res as DeviceData;
            updateDeviceTable(data);
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
        return Promise.resolve();
    }

    return {
        deviceTable,
        deviceOnStateCount,
        deviceAllCount,
        getRadarDeviceData,
        getLicenseDeviceData,
        clearDeviceTable,
    }
})
