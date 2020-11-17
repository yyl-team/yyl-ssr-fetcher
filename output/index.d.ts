import { CoreOptions } from 'request';
/** fetcher 配置 */
export interface FetcherOption {
    /** 超时设置 */
    timeout?: number;
    /** 超时设置 */
    userAgent?: string;
    /** request 配置 */
    requestOption?: CoreOptions;
    /** 默认请求协议 */
    defaultProtocol?: string;
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
    constructor(option?: FetcherOption);
    /** url 格式化 */
    private formatUrl;
    /** get 请求 */
    get<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>;
    /** post 请求 */
    post<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>;
}
