import * as Cesium from "cesium";

export const ACCESS_TOKEN:string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmOTlmMjhiNS03NGQzLTQ1OWUtOWQyNy03YjM4YWE2YjM1MTgiLCJpZCI6ODk3NjMsImlhdCI6MTY0OTkyMDI1MH0.VSOf-js_Wy1Xh9snbqtkxJgw4IEZSkDYFd1YSqjLqjE';

export const DEFAULT_ENDTIME:number = 3600;

export const MAX_HEIGHT_DIFFERENCE:number = 2;

export const MAX_COORDINATE_DIFFERENCE:number = 0.0006;

export const ROAD_POSITION:[number,number,number] = [
    -2330944.4049780667,
    4993865.472109023,
    3199941.793547205,
]

export const ROAD_ORIENTATION:[number,number,number] = [
    Cesium.Math.toRadians(89.01),
    Cesium.Math.toRadians(0),
    Cesium.Math.toRadians(0),
]

export const DEFAULT_CAMERA_POSITION:Array<[number,number,number]> = [
    [115.0057112, 30.3014441, 378],
    [114.9797447, 30.2943497, 350],
    [114.9455515, 30.2941977, 400],
    [114.9238365, 30.2935548, 343],
];

export const DEFAULT_CAMERA_ORIENTATION = {
    heading: Cesium.Math.toRadians(17.70),
    pitch: Cesium.Math.toRadians(-35.12),
    roll: 0,
}

export const INITIAL_CAMERA_POSITION:[number,number,number] = [
    115.0050483,
    30.2986075,
    600,
];

export const INITIAL_CAMERA_ORIENTATION = {
    heading: Cesium.Math.toRadians(357.99),
    pitch: Cesium.Math.toRadians(-35.38),
    roll: 0.0,
}

export const DEFAULT_CAR_CATE:string = "小型车";

export const DEFAULT_LABEL_COLOR:[number,number,number,number] = [39, 177, 182, 255]

export const DEFAULT_LABEL_DISTANCE:[number,number] = [0.0, 300]

export const DEFAULT_LABEL_EYEOFFSET:[number,number,number] = [0, 7, 0]

export const DEFAULT_TRACK_POSITION:[number,number,number] = [90, 10, 30]

export const DATE_JULIAN_OFFSET_HOURS:number = 8;

