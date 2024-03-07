import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {HttpErrorData, HttpErrorType, HttpRequestMethod} from "@/model/index.ts";
import {parseStrToHttpMethod} from "@/util/process.ts";
import {DEFAULT_HTTP_TIMEOUT} from "@/static/interval.ts";

// HTTP请求默认配置实例
const service: AxiosInstance = axios.create({
    baseURL: '/api',                   // 前缀地址
    timeout: DEFAULT_HTTP_TIMEOUT,     // 超时时间
    responseType: 'json',              // 返回类型
    headers: {                         // 请求头
        "Content-Type": "application/json;charset=UTF-8"
    }
});

// HTTP发起请求前的拦截器
service.interceptors.request.use((req) => {
    return req;
});

// HTTP接收响应前的拦截器
service.interceptors.response.use((resp) => {
    return resp;
});

/**
 * httpGet<T>()
 * HTTP请求GET类型入口函数(泛型参数为指定的返回类型)
 * @param url 请求后缀地址
 * @param params 请求参数
 * @return {Promise<T|HttpErrorData>} 和request<T>()相同
 */
export async function httpGet<T>(url:string , params = {}):Promise<T|HttpErrorData> {
    return await request<T>({
        url: url,
        params: params,
        method: HttpRequestMethod.GET
    });
}

/**
 * httpPost<T>()
 * HTTP请求POST类型入口函数(泛型参数为指定的返回类型)
 * @param url 请求后缀地址
 * @param data 请求体
 * @return {Promise<T|HttpErrorData>} 和request<T>()相同
 */
export async function httpPost<T>(url:string, data = {}):Promise<T|HttpErrorData>{
    return await request<T>({
        url: url,
        data: data,
        method: HttpRequestMethod.POST
    });
}

/**
 * httpErrorOutput()
 * HTTP错误信息默认格式控制台输出
 * @param err 错误信息
 */
export function httpErrorOutput(err: HttpErrorData) {
    console.log(`请求${err.type} ${err.url}时发生${err.type}\n错误信息:${err.message}`);
}

/**
 * request<T>()
 * HTTP请求处理函数(泛型参数为指定的返回类型)
 * @param config 请求具体参数
 * @return {Promise<T>} 响应成功时,返回指定类型的数据
 * @return {Promise<HttpErrorData>} 请求/响应失败时,返回错误信息
 */
async function request<T>(config: AxiosRequestConfig):Promise<T|HttpErrorData> {
    try {
        const res = await service.request<T,AxiosResponse<T>>(config);
        return Promise.resolve(res.data);
    } catch (err) {
        const errData = handleRequestError(config.url!, config.method!, err as AxiosError);
        return Promise.reject(errData);
    }
}

/**
 * handleRequestError()
 * HTTP错误处理函数,封装返回错误信息
 * @param url 请求地址
 * @param method 请求方式
 * @param err 请求过程中产生的错误
 * @return {HttpErrorData} 返回错误信息
 */
function handleRequestError(url:string, method:string, err:AxiosError):HttpErrorData{
    let errType:HttpErrorType;      // 错误类型
    let errMessage:string;          // 错误信息
    // 分支1: 响应状态错误(有请求有响应)
    if (err.response) {
        errType = HttpErrorType.RESPONSE_EXCEPTION;
        errMessage = `${err.response.status} ${err.response.statusText}`;
    // 分支2: 响应接收错误(有请求无响应)
    } else if (err.request) {
        errType = HttpErrorType.RESPONSE_ERROR;
        errMessage = err.request.message;
    // 分支3: 请求发送错误(无请求)
    } else {
        errType = HttpErrorType.REQUEST_ERROR;
        errMessage = err.message;
    }
    return {
        url: url,
        method: parseStrToHttpMethod(method),
        type: errType,
        message: errMessage,
    };
}
