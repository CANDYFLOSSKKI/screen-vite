export type DeviceData = {
    count: number,
    entities: Array<DeviceEntity>,
    onState: number,
}

export type DeviceEntity = {
    deviceId: string,
    location?: string,
    roadDirect: string,
    state: string,
}

export type DeviceTableData = {
    deviceId: string,
    loc: string,
    roadDirect: string,
    state: string,
}

export type EventQueryData = {
    count: number,                      // 事件数量
    entities: Array<EventQueryEntity>,  // 事件具体信息
    day: string,                        // 日期(如2022-11-04)
}

export type EventQueryEntity = {
    eventType: string,  // 事件类型
    id: string,         // 事件车辆车牌号
    location: string,   // 事件发生位置
    time: string,       // 事件发生开始时间(如2022-11-04|17:14:16)
    trajId: number,     // 事件车辆轨迹号(如1667553256187)
}

export type AccumulateCarNumberData = {
    carNumberLeft: number,
    carNumberRight: number,
}

export type RealTimeCarData = {
    count: number,                          // 车辆数量
    entities: Array<RealTimeCarEntity>,     // 车辆具体信息
    leftCarCount: number,                   // 左幅车辆数量
    rightCarCount: number,                  // 右幅车辆数量
    timeStamp: string,                      // 车辆时间
}

export type RealTimeCarEntity = {
    angle: number,              // 车辆航向角
    carNumber: string,          // 车牌照
    direction: number,          // 1左幅;2右幅
    location: string,           // 里程号(如K4+430)
    position: Array<number>,    // 经纬度
    speed: number,              // 速度(km/h)
    trajId?: number,
}

export type ViewModelData = {
    label: string,
    value: number,
}

export type ModelSwitchData = {
    model: number,
    name: string,
    time: string,
    trajId: number,
}

export type SpecificCarData = {
    count: number,
    entities: Array<RealTimeCarEntity>,
    timeEnd: string,
    timeStart: string,
}

export type SecInfoElem = {
    xsecName: string,
    xsecValue: number,
}

export type SecTimeRangeElem = {
    timeRangeName: string,
    timeRangeValue: number,
}

export type SecQueryData = {
    count: number,                      // 断面数据流量
    entities: Array<SecQueryEntity>,    // 断面具体信息
    time: string,                       // 断面数据日期(如2022-11-04)
}

export type SecQueryEntity = {
    avgQleft: number,           // 左幅断面流量(/h)
    avgQright: number,          // 右幅断面流量(/h)
    avgSpeedleft: number,       // 左幅断面速度(km/h)
    avgSpeedright: number,      // 右幅断面速度(km/h)
    time: string,               // 断面数据时间(如2022-11-04|16:11)
    timeStampStart: number,     // 断面数据时间戳(如1667549467600)
    xsecName: string,           // 断面名称
    xsecValue: number,          // 断面位置(如2000)
    xsecLocation?: string,
}

export type SecTableData = {
    name: string,           // 断面名称
    value: number,          // 断面位置
    data: Array<SecQueryEntity>,
}

export type CarTableData = {
    name: string,
    cate: string,
    speed: string,
    location: string,
}
