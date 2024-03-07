import {defineStore} from "pinia";
import {ref} from "vue";
import {getAccumulateCarAPI} from "@/api/info.ts";
import {httpErrorOutput} from "@/util/axios.ts";
import {AccumulateCarNumberData} from "@/model/module.ts";
import {HttpErrorData} from "@/model/index.ts";

export const useInfoStore = defineStore('info', () => {
    // 武鄂方向累积车辆
    const leftCarSum = ref<number>(0);
    // 鄂武方向累积车辆
    const rightCarSum = ref<number>(0);
    // 武鄂方向在途车辆
    const leftCarCount = ref<number>(0);
    // 鄂武方向在途车辆
    const rightCarCount = ref<number>(0);

    function clearCarCount() {
        leftCarCount.value = 0;
        rightCarCount.value = 0;
    }
    function clearCarSum() {
        leftCarSum.value = 0;
        rightCarSum.value = 0;
    }
    function setCarCount(left:number, right:number){
        clearCarCount();
        leftCarCount.value = left>0 ? left : 0;
        rightCarCount.value = right>0 ? right : 0;
    }
    function setCarSum(left:number, right:number) {
        clearCarSum();
        leftCarSum.value = left>0 ? left : (leftCarCount.value>0 ? leftCarCount.value : 0);
        rightCarSum.value = right>0 ? right : (rightCarCount.value>0 ? rightCarCount.value : 0);
    }

    /**
     * getAccumulateCarNumber()
     * 获取累计车辆数据信息
     */
    async function getAccumulateCarNumber() {
        await getAccumulateCarAPI().then((res) => {
            const data = res as AccumulateCarNumberData;
            setCarSum(data.carNumberLeft,data.carNumberRight);
        }).catch((err) => {
            httpErrorOutput(err as HttpErrorData);
        })
    }

    /**
     * updateInfo()
     * Model模块获取到实时车辆时更新实时数据信息,同时更新总车辆数据信息
     * @param left 实时左向车辆数
     * @param right 实时右向车辆数
     */
    async function updateInfo(left:number, right:number) {
        setCarCount(left,right);
        await getAccumulateCarNumber();
    }

    return {
        leftCarSum,
        rightCarSum,
        leftCarCount,
        rightCarCount,
        clearCarCount,
        clearCarSum,
        updateInfo,
    }
})
