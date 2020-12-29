/*!
 * yyl-ssr-fetcher esm 0.2.2
 * (c) 2020 - 2020 jackness
 * Released under the MIT License.
 */
import request from 'request';
import extend from 'extend';

/** 日志类型 */
var LogType;
(function (LogType) {
    LogType["Info"] = "info";
    LogType["Success"] = "success";
    LogType["Warn"] = "warn";
    LogType["Error"] = "error";
})(LogType || (LogType = {}));
/** 无协议匹配 */
const NO_PROTOCOL_REG = /^\/\//;
/** 默认ua */
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 ServerSide';
/** fetcher 主函数 */
class Fetcher {
    constructor(option) {
        /** 超时时间 */
        this.timeout = 5000;
        /** 请求ua */
        this.userAgent = DEFAULT_UA;
        /** request 配置 */
        this.requestOption = {};
        /** 默认 protocol */
        this.defaultProtocol = 'http:';
        /** 默认logger */
        this.logger = () => { };
        if (option === null || option === void 0 ? void 0 : option.timeout) {
            this.timeout = option.timeout;
        }
        if (option === null || option === void 0 ? void 0 : option.userAgent) {
            this.userAgent = option.userAgent;
        }
        if (option === null || option === void 0 ? void 0 : option.requestOption) {
            this.requestOption = option.requestOption;
        }
        // request option 配置
        this.requestOption = extend({
            headers: {
                'User-Agent': this.userAgent
            },
            timeout: this.timeout
        }, this.requestOption);
        // logger 初始化
        if (option === null || option === void 0 ? void 0 : option.logger) {
            this.logger = option.logger;
        }
    }
    /** url 格式化 */
    formatUrl(url) {
        const { defaultProtocol } = this;
        let rUrl = url;
        if (rUrl.match(NO_PROTOCOL_REG)) {
            rUrl = `${defaultProtocol}${rUrl}`;
        }
        return rUrl;
    }
    /** get 请求 */
    get(url, req, option) {
        const { requestOption } = this;
        const rUrl = this.formatUrl(url);
        const logPrefix = `请求${rUrl}`;
        const ref = (option === null || option === void 0 ? void 0 : option.ref) || rUrl;
        let param = Object.assign({ qs: req || {} }, requestOption);
        if (requestOption) {
            param = extend(param, option);
        }
        return new Promise((resolve, reject) => {
            this.logger({
                path: ref,
                type: LogType.Info,
                args: [logPrefix, '类型 GET', '参数', param]
            });
            request.get(rUrl, param, (err, res, body) => {
                if (!err) {
                    if (res.statusCode === 200) {
                        try {
                            const r = JSON.parse(body);
                            this.logger({
                                path: ref,
                                type: LogType.Success,
                                args: [`${logPrefix} 成功`, '返回值', r]
                            });
                            resolve(r);
                        }
                        catch (er) {
                            const errMsg = `parse error: ${body}`;
                            this.logger({
                                path: ref,
                                type: LogType.Error,
                                args: [`${logPrefix} 失败`, errMsg]
                            });
                            reject(new Error(`${logPrefix}失败: ${errMsg}`));
                        }
                    }
                    else {
                        const errMsg = `状态非 200: ${res.statusCode}`;
                        this.logger({
                            path: ref,
                            type: LogType.Error,
                            args: [`${logPrefix} 失败`, errMsg]
                        });
                        reject(new Error(`${logPrefix}失败: ${errMsg}`));
                    }
                }
                else {
                    this.logger({
                        path: ref,
                        type: LogType.Error,
                        args: [`${logPrefix} 失败`, err]
                    });
                    reject(err);
                }
            });
        });
    }
    /** post 请求 */
    post(url, req, option) {
        const { requestOption } = this;
        const rUrl = this.formatUrl(url);
        const logPrefix = `请求${rUrl}`;
        const ref = (option === null || option === void 0 ? void 0 : option.ref) || rUrl;
        let param = Object.assign({ formData: req || {} }, requestOption);
        if (requestOption) {
            param = extend(param, option);
        }
        return new Promise((resolve, reject) => {
            this.logger({
                path: ref,
                type: LogType.Info,
                args: [logPrefix, '类型 Post', '参数', param]
            });
            request.post(rUrl, param, (err, res, body) => {
                if (!err) {
                    if (res.statusCode === 200) {
                        try {
                            const r = JSON.parse(body);
                            this.logger({
                                path: ref,
                                type: LogType.Success,
                                args: [`${logPrefix} 成功`, '返回值', r]
                            });
                            resolve(r);
                        }
                        catch (er) {
                            const errMsg = `parse error: ${body}`;
                            this.logger({
                                path: ref,
                                type: LogType.Error,
                                args: [`${logPrefix} 失败`, errMsg]
                            });
                            reject(new Error(`${logPrefix}失败: ${errMsg}`));
                        }
                    }
                    else {
                        const errMsg = `状态非 200: ${res.statusCode}`;
                        this.logger({
                            path: ref,
                            type: LogType.Error,
                            args: [`${logPrefix} 失败`, errMsg]
                        });
                        reject(new Error(`${logPrefix}失败: ${errMsg}`));
                    }
                }
                else {
                    this.logger({
                        path: ref,
                        type: LogType.Error,
                        args: [`${logPrefix} 失败`, err]
                    });
                    reject(err);
                }
            });
        });
    }
}

export { Fetcher, LogType };
