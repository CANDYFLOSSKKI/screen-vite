import {ref} from "vue";

export const eChartsSectionFlowRightData = ref({
    title: {
        text: '武鄂方向断面流量',
        textStyle: { color: 'white' }
    },
    backgroundColor: '',
    xAxis: {
        type: 'category',
        data: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        boundaryGap: false,
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120],
            type: 'line',
            smooth: true
        }
    ]
});

export const eChartsSectionFlowLeftData = ref({
    title: {
        text: '鄂武方向断面流量',
        textStyle: { color: 'white' }
    },
    backgroundColor: '',
    xAxis: {
        type: 'category',
        data: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        boundaryGap: false,
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120],
            type: 'line',
            smooth: true
        }
    ]
});

export const eChartsSectionSpeedRightData = ref({
    title: {
        text: '武鄂方向断面平均车速',
        textStyle: { color: 'white' }
    },
    backgroundColor: '',
    xAxis: {
        type: 'category',
        data: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        boundaryGap: false,
        axisLabel: { interval: 0, rotate: 40 },
        grid: { left: '10%', bottom: '35%' },
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120],
            type: 'line',
            smooth: true
        }
    ]
});

export const eChartsSectionSpeedLeftData = ref({
    title: {
        text: '鄂武方向断面平均车速',
        textStyle: { color: 'white' }
    },
    backgroundColor: '',
    xAxis: {
        type: 'category',
        data: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        boundaryGap: false,
        axisLabel: { interval: 0, rotate: 40 },
        grid: { left: '10%', bottom: '35%' },
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120],
            type: 'line',
            smooth: true
        }
    ]
});

export const eChartsModelSpeedData = ref({
    title: {
        text: '车辆位置速度变化表',
        textStyle: { color: 'white' },
        x: 'center',
    },
    backgroundColor: 'rgba(20,30,52,0.5)',
    xAxis: {
        type: 'category',
        data: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        boundaryGap: false,
        axisLabel: { interval: 0, rotate: 40 },
        grid: { left: '10%', bottom: '35%' },
    },
    yAxis: { type: 'value' },
    series: [
        {
            data: [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120],
            type: 'line',
            smooth: true
        }
    ]
});

export function clearEChartsData(data:any) {
    data.value.xAxis.data = [];
    data.value.series[0].data = [];
}

export function setDefaultEChartsData(data:any) {
    data.value.xAxis.data = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'];
    data.value.series[0].data = [80, 90, 87, 100, 120, 93, 80, 90, 87, 100, 120];
}
