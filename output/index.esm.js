/*!
 * yyl-ssr-fetcher esm 0.1.0
 * (c) 2020 - 2020 jackness
 * Released under the MIT License.
 */
import request from 'request';
import extend from 'extend';

/** 无协议匹配 */
const NO_PROTOCOL_REG = /^\/\//;
/** 默认ua */
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 ServerSide';
/** fetcher 主函数 */
class Fetcher {
    constructor(option) {
        /** 超时时间 */
        this.timeout = 3000;
        /** 请求ua */
        this.userAgent = DEFAULT_UA;
        /** request 配置 */
        this.requestOption = {};
        /** 默认 protocol */
        this.defaultProtocol = 'http:';
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
        let param = Object.assign({ qs: req || {} }, requestOption);
        if (requestOption) {
            param = extend(param, option);
        }
        return new Promise((resolve, reject) => {
            request.get(url, param, (err, res, body) => {
                if (!err) {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(body));
                        }
                        catch (er) {
                            reject(new Error(`${logPrefix}失败: parse error: ${body}`));
                        }
                    }
                    else {
                        reject(new Error(`${logPrefix}失败: 状态非 200: ${res.statusCode}`));
                    }
                }
                else {
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
        let param = Object.assign({ formData: req || {} }, requestOption);
        if (requestOption) {
            param = extend(param, option);
        }
        return new Promise((resolve, reject) => {
            request.post(url, param, (err, res, body) => {
                if (!err) {
                    if (res.statusCode === 200) {
                        try {
                            resolve(JSON.parse(body));
                        }
                        catch (er) {
                            reject(new Error(`${logPrefix}失败: parse error: ${body}`));
                        }
                    }
                    else {
                        reject(new Error(`${logPrefix}失败: 状态非 200: ${res.statusCode}`));
                    }
                }
                else {
                    reject(err);
                }
            });
        });
    }
}

export { Fetcher };
