import { CoreOptions } from 'request';
/** 日志类型 */
export declare enum LogType {
    Info = "info",
    Success = "success",
    Warn = "warn",
    Error = "error"
}
/** 日志参数 */
export interface LogProps {
    /** 日志类型 */
    type: LogType;
    /** 日志来源 */
    path: string;
    /** 日志内容 */
    args: any[];
}
/** request 配置 */
export interface RequestOption extends CoreOptions {
    /** 请求来源-用于logger */
    ref?: string;
}
/** fetcher 配置 */
export interface FetcherOption {
    /** 超时设置 */
    timeout?: number;
    /** 超时设置 */
    userAgent?: string;
    /** request 配置 */
    requestOption?: RequestOption;
    /** 默认请求协议 */
    defaultProtocol?: string;
    /** 日志 */
    logger?: (props: LogProps) => void;
}
/** fetcher 属性 */
export declare type FetcherProperty = Required<FetcherOption>;
/** fetcher 主函数 */
export declare class Fetcher {
    /** 超时时间 */
    private timeout;
    /** 请求ua */
    private userAgent;
    /** request 配置 */
    private requestOption;
    /** 默认 protocol */
    private defaultProtocol;
    /** 默认logger */
    private logger;
    constructor(option?: FetcherOption);
    /** url 格式化 */
    private formatUrl;
    /** get 请求 */
    get<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>;
    /** post 请求 */
    post<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>;
}
