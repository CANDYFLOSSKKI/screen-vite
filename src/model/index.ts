export type SelectOption = {
    label: string,
    value: number
}

export const enum HttpRequestMethod {
    GET = 'get',
    POST = 'post',
}

export const enum HttpErrorType {
    REQUEST_ERROR = '请求发送错误',
    RESPONSE_ERROR = '响应接收错误',
    RESPONSE_EXCEPTION = '响应状态错误',
}

export type HttpErrorData = {
    url: string,                // 请求URL
    method: HttpRequestMethod,  // 请求方式
    type: HttpErrorType,        // 错误类型
    message: string,            // 错误信息
}
