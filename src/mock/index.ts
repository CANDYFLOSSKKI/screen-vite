import {
    AccumulateCarNumberData,
    DeviceData,
    EventQueryData,
    RealTimeCarData, SecInfoElem, SecQueryData, SecQueryEntity, SecTimeRangeElem,
    SpecificCarData
} from "@/model/module.ts";
import {MockMethod} from "vite-plugin-mock";

export default [
    {
        url: '/api/getAccumulateCar',
        method: 'get',
        // @ts-ignore
        response: ({query}): AccumulateCarNumberData => {
            return {
                carNumberLeft: 1163,
                carNumberRight: 665
            }
        }
    },
    {
        url: '/api/carEventToday',
        method: 'get',
        // @ts-ignore
        response: ({query}):EventQueryData => {
            return {
                count: 2,
                entities: [
                    {eventType: '占用应急车道', id: '鄂A11002', location: 'K2+750', time: '2022-10-09|10:00:14', trajId: 1665280800001,},
                    {eventType: '占用应急车道', id: '鄂A11004', location: 'K3+810', time: '2022-10-09|10:00:36', trajId: 1665280800003,},
                ],
                day: '2022-10-09',
            }
        }
    },
    {
        url: '/api/carEventSpecificDay',
        method: 'get',
        // @ts-ignore
        response: ({query}):EventQueryData => {
            return {
                count: 0,
                entities: [],
                day: '2022-10-09',
            }
        }
    },
    {
        url: '/api/radarDevice',
        method: 'get',
        // @ts-ignore
        response: ({query}):DeviceData => {
            return {
                count: 17,
                entities: [
                    {roadDirect: "右幅", location: "K4+430", state: "在线", deviceId: "机场雷达1"},
                    {roadDirect: "左幅", location: "K6+240", state: "在线", deviceId: "机场雷达10"},
                    {roadDirect: "左幅", location: "K7+70", state: "在线", deviceId: "机场雷达11"},
                    {roadDirect: "左幅", location: "K9+90", state: "在线", deviceId: "机场雷达12"},
                    {roadDirect: "左幅", location: "K10+80", state: "在线", deviceId: "机场雷达13"},
                    {roadDirect: "左幅", location: "K11+60", state: "在线", deviceId: "机场雷达14"},
                    {roadDirect: "左幅", location: "K0+0", state: "离线", deviceId: "机场雷达15"},
                    {roadDirect: "左幅", location: "K0+0", state: "离线", deviceId: "机场雷达16"},
                    {roadDirect: "左幅", location: "K0+0", state: "离线", deviceId: "无探测范围"},
                    {roadDirect: "右幅", location: "K5+470", state: "在线", deviceId: "机场雷达2"},
                    {roadDirect: "右幅", location: "K7+370", state: "在线", deviceId: "机场雷达3"},
                    {roadDirect: "右幅", location: "K8+360", state: "在线", deviceId: "机场雷达4"},
                    {roadDirect: "右幅", location: "K9+330", state: "在线", deviceId: "机场雷达5"},
                    {roadDirect: "右幅", location: "K10+300", state: "在线", deviceId: "机场雷达6"},
                    {roadDirect: "右幅", location: "K11+230", state: "在线", deviceId: "机场雷达7"},
                    {roadDirect: "右幅", location: "K12+250", state: "在线", deviceId: "机场雷达8"},
                    {roadDirect: "左幅", location: "K5+110", state: "在线", deviceId: "机场雷达9"}
                ],
                onState: 14
            }
        }
    },
    {
        url: '/api/licenseDevice',
        method: 'get',
        // @ts-ignore
        response: ({query}):DeviceData => {
            return {
                count: 9,
                entities: [
                    {roadDirect: "右幅", state: "在线", deviceId: "S2700015051101"},
                    {roadDirect: "右幅", state: "在线", deviceId: "S2700015051102"},
                    {roadDirect: "右幅", state: "在线", deviceId: "S2700015051103"},
                    {roadDirect: "右幅", state: "在线", deviceId: "S2700015051104"},
                    {roadDirect: "右幅", state: "在线", deviceId: "S2700015051106"},
                    {roadDirect: "左幅", state: "在线", deviceId: "S2700015051201"},
                    {roadDirect: "左幅", state: "在线", deviceId: "S2700015051202"},
                    {roadDirect: "左幅", state: "在线", deviceId: "S2700015051203"},
                    {roadDirect: "左幅", state: "在线", deviceId: "S2700015051204"}
                ],
                onState: 9
            }
        }
    },
    {
        url: '/api/realTimeCarData',
        method: 'get',
        // @ts-ignore
        response: ({query}): RealTimeCarData => {
            return {
                timeStamp: "2022-10-09|10:00:00",
                count: 0,
                leftCarCount: 0,
                rightCarCount: 0,
                entities: []
            }
        }
    },
    {
        url: '/api/getCarDataByCarId',
        method: 'get',
        // @ts-ignore
        response: ({query}): SpecificCarData => {
            return {
                count: 3,
                entities: [
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K2+750", position: [114.98300170898438, 30.29871368408203], speed: 111, direction: 2},
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K3+750", position: [114.9844895, 30.2991710], speed: 111, direction: 2},
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K4+750", position: [114.9862929, 30.2998783], speed: 111, direction: 2},
                ],
                timeStart: "2022-10-09|10:00:00",
                timeEnd: "2022-10-09|10:02:00",
            }
        }
    },
    {
        url: '/api/getCarDataByTimeAndTrajId',
        method: 'get',
        // @ts-ignore
        response: ({query}): SpecificCarData => {
            return {
                count: 3,
                entities: [
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K2+750", position: [114.98300170898438, 30.29871368408203], speed: 111, direction: 2},
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K3+750", position: [114.9844895, 30.2991710], speed: 111, direction: 2},
                    {carNumber: "鄂A11002", trajId: 1665280800001, angle: 73.4444, location: "K4+750", position: [114.9862929, 30.2998783], speed: 111, direction: 2},
                ],
                timeStart: "2022-10-09|10:00:00",
                timeEnd: "2022-10-09|10:02:00",
            }
        }
    },
    {
        url: '/api/secInfo',
        method: 'get',
        // @ts-ignore
        response: ({query}):Array<SecInfoElem> => {
            return [
                { xsecName: 'K02+000', xsecValue: 2000 },
                { xsecName: 'K03+500', xsecValue: 3500 },
                { xsecName: 'K04+000', xsecValue: 4000 },
                { xsecName: 'K04+500', xsecValue: 4500 },
            ]
        }
    },
    {
        url: '/api/timeRangeInfo',
        method: 'get',
        // @ts-ignore
        response: ({query}):Array<SecTimeRangeElem> => {
            return [
                { timeRangeName: '最近20分钟数据', timeRangeValue: 20 },
                { timeRangeName: '最近40分钟数据', timeRangeValue: 40 },
                { timeRangeName: '最近1小时数据', timeRangeValue: 60 },
                { timeRangeName: '最近2小时数据', timeRangeValue: 120 },
            ]
        }
    },
    {
        url: '/api/secToday',
        method: 'get',
        // @ts-ignore
        response: ({query}):SecQueryData => {
            return {
                count: 40,
                entities: secTodayQueryMockData,
                time: '2022-10-09'
            }
        }
    },
    {
        url: '/api/secSpecificDay',
        method: 'get',
        // @ts-ignore
        response: ({query}):SecQueryData => {
            return {
                count: 0,
                entities: [],
                time: '2022-10-09'
            }
        }
    },
    {
        url: '/api/lastedSecData',
        method: 'get',
        // @ts-ignore
        response: ({query}):SecQueryData => {
            return {
                count: 4,
                entities: secLastedQueryMockData,
                time: '2022-10-09'
            }
        }
    }
] as MockMethod[]

const secTodayQueryMockData:Array<SecQueryEntity> = [
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K02+000"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K03+500"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K04+000"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K04+500"},
    {timeStampStart: 1665280920200, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:02", xsecName: "K02+000"},
    {timeStampStart: 1665280920200, avgSpeedleft: 91.479965, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:02", xsecName: "K03+500"},
    {timeStampStart: 1665280920200, avgSpeedleft: 65.7864, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 36, time: "2022-10-09|10:02", xsecName: "K04+000"},
    {timeStampStart: 1665280920200, avgSpeedleft: 66.13992, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 24, time: "2022-10-09|10:02", xsecName: "K04+500"},
    {timeStampStart: 1665280980200, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:03", xsecName: "K02+000"},
    {timeStampStart: 1665280980200, avgSpeedleft: 63.256683, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 36, time: "2022-10-09|10:03", xsecName: "K03+500"},
    {timeStampStart: 1665280980200, avgSpeedleft: 75.45996, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 24, time: "2022-10-09|10:03", xsecName: "K04+000"},
    {timeStampStart: 1665280980200, avgSpeedleft: 103.32864, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 24, time: "2022-10-09|10:03", xsecName: "K04+500"},
    {timeStampStart: 1665281040200, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:04", xsecName: "K02+000"},
    {timeStampStart: 1665281040200, avgSpeedleft: 68.65992, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 24, time: "2022-10-09|10:04", xsecName: "K03+500"},
    {timeStampStart: 1665281040200, avgSpeedleft: 95.150154, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:04", xsecName: "K04+000"},
    {timeStampStart: 1665281040200, avgSpeedleft: 81.83016, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:04", xsecName: "K04+500"},
    {timeStampStart: 1665281100200, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:05", xsecName: "K02+000"},
    {timeStampStart: 1665281100200, avgSpeedleft: 70.22016, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 24, time: "2022-10-09|10:05", xsecName: "K03+500"},
    {timeStampStart: 1665281100200, avgSpeedleft: 73.77012, xsecValue: 4000, avgSpeedright: 64.92384, avgQright: 36, avgQleft: 24, time: "2022-10-09|10:05", xsecName: "K04+000"},
    {timeStampStart: 1665281100200, avgSpeedleft: 60.90012, xsecValue: 4500, avgSpeedright: 57.895203, avgQright: 12, avgQleft: 24, time: "2022-10-09|10:05", xsecName: "K04+500"},
    {timeStampStart: 1665281160400, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:06", xsecName: "K02+000"},
    {timeStampStart: 1665281160400, avgSpeedleft: 59.4, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:06", xsecName: "K03+500"},
    {timeStampStart: 1665281160400, avgSpeedleft: 69.19992, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:06", xsecName: "K04+000"},
    {timeStampStart: 1665281160400, avgSpeedleft: 110, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:06", xsecName: "K04+500"},
    {timeStampStart: 1665281220400, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:07", xsecName: "K02+000"},
    {timeStampStart: 1665281220400, avgSpeedleft: 110, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:07", xsecName: "K03+500"},
    {timeStampStart: 1665281220400, avgSpeedleft: 110, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:07", xsecName: "K04+000"},
    {timeStampStart: 1665281220400, avgSpeedleft: 110, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:07", xsecName: "K04+500"},
    {timeStampStart: 1665281280400, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:08", xsecName: "K02+000"},
    {timeStampStart: 1665281280400, avgSpeedleft: 110, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:08", xsecName: "K03+500"},
    {timeStampStart: 1665281280400, avgSpeedleft: 66.69108, xsecValue: 4000, avgSpeedright: 82.76724, avgQright: 12, avgQleft: 48, time: "2022-10-09|10:08", xsecName: "K04+000"},
    {timeStampStart: 1665281280400, avgSpeedleft: 68.78988, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 36, time: "2022-10-09|10:08", xsecName: "K04+500"},
    {timeStampStart: 1665281340600, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:09", xsecName: "K02+000"},
    {timeStampStart: 1665281340600, avgSpeedleft: 71.06688, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 36, time: "2022-10-09|10:09", xsecName: "K03+500"},
    {timeStampStart: 1665281340600, avgSpeedleft: 110, xsecValue: 4000, avgSpeedright: 70.39656, avgQright: 12, avgQleft: 0, time: "2022-10-09|10:09", xsecName: "K04+000"},
    {timeStampStart: 1665281340600, avgSpeedleft: 110, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:09", xsecName: "K04+500"},
    {timeStampStart: 1665281400800, avgSpeedleft: 110, xsecValue: 2000, avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:10", xsecName: "K02+000"},
    {timeStampStart: 1665281400800, avgSpeedleft: 65.520004, xsecValue: 3500, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:10", xsecName: "K03+500"},
    {timeStampStart: 1665281400800, avgSpeedleft: 76.11012, xsecValue: 4000, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:10", xsecName: "K04+000"},
    {timeStampStart: 1665281400800, avgSpeedleft: 84.53016, xsecValue: 4500, avgSpeedright: 110, avgQright: 0, avgQleft: 12, time: "2022-10-09|10:10", xsecName: "K04+500"},
]

const secLastedQueryMockData:Array<SecQueryEntity> = [
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 2000, xsecLocation: "2000", avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K02+000"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 3500, xsecLocation: "3500", avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K03+500"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 4000, xsecLocation: "4000", avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K04+000"},
    {timeStampStart: 1665280800200, avgSpeedleft: 110, xsecValue: 4500, xsecLocation: "4500", avgSpeedright: 110, avgQright: 0, avgQleft: 0, time: "2022-10-09|10:00", xsecName: "K04+500"}
]
