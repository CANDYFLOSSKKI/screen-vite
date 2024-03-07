
export const enum Timeout {
    SECOND = 1000,
    MINUTE = 60 * SECOND,
}

export const DEFAULT_HTTP_TIMEOUT:number = 10 * Timeout.SECOND;

export const REALTIME_FLUSH_INTERVAL:number = 5 * Timeout.SECOND;

export const EVENT_FLUSH_INTERVAL:number = 5 * Timeout.MINUTE;

export const DEVICE_FLUSH_INTERVAL:number = 5 * Timeout.MINUTE;

export const SECTION_FLOW_FLUSH_INTERVAL:number = 5 * Timeout.MINUTE;

export const SECTION_SPEED_AVG_FLUSH_INTERVAL:number = 5 * Timeout.MINUTE;

export const SECTION_SPEED_LASTED_FLUSH_INTERVAL:number = 5 *Timeout.SECOND;
