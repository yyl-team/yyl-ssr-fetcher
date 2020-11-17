import request, { CoreOptions } from 'request'
import extend from 'extend'

/** fetcher 配置 */
export interface FetcherOption {
  /** 超时设置 */
  timeout?: number
  /** 超时设置 */
  userAgent?: string
  /** request 配置 */
  requestOption?: CoreOptions
  /** 默认请求协议 */
  defaultProtocol?: string
}

/** 无协议匹配 */
const NO_PROTOCOL_REG = /^\/\//

/** fetcher 属性 */
export type FetcherProperty = Required<FetcherOption>

/** 默认ua */
const DEFAULT_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36 ServerSide'

/** fetcher 主函数 */
export class Fetcher {
  /** 超时时间 */
  private timeout: FetcherProperty['timeout'] = 5000
  /** 请求ua */
  private userAgent: FetcherProperty['userAgent'] = DEFAULT_UA
  /** request 配置 */
  private requestOption: FetcherProperty['requestOption'] = {}
  /** 默认 protocol */
  private defaultProtocol: FetcherProperty['defaultProtocol'] = 'http:'
  constructor(option?: FetcherOption) {
    if (option?.timeout) {
      this.timeout = option.timeout
    }
    if (option?.userAgent) {
      this.userAgent = option.userAgent
    }

    if (option?.requestOption) {
      this.requestOption = option.requestOption
    }

    // request option 配置
    this.requestOption = extend(
      {
        headers: {
          'User-Agent': this.userAgent
        },
        timeout: this.timeout
      },
      this.requestOption
    )
  }

  /** url 格式化 */
  private formatUrl(url: string) {
    const { defaultProtocol } = this
    let rUrl = url
    if (rUrl.match(NO_PROTOCOL_REG)) {
      rUrl = `${defaultProtocol}${rUrl}`
    }
    return rUrl
  }

  /** get 请求 */
  get<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']) {
    const { requestOption } = this
    const rUrl = this.formatUrl(url)
    const logPrefix = `请求${rUrl}`

    let param: FetcherProperty['requestOption'] = {
      qs: req || {},
      ...requestOption
    }
    if (requestOption) {
      param = extend<FetcherProperty['requestOption'], FetcherOption['requestOption']>(
        param,
        option
      )
    }

    return new Promise<O>((resolve, reject) => {
      request.get(rUrl, param, (err, res, body) => {
        if (!err) {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(body))
            } catch (er) {
              reject(new Error(`${logPrefix}失败: parse error: ${body}`))
            }
          } else {
            reject(new Error(`${logPrefix}失败: 状态非 200: ${res.statusCode}`))
          }
        } else {
          reject(err)
        }
      })
    })
  }

  /** post 请求 */
  post<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']) {
    const { requestOption } = this
    const rUrl = this.formatUrl(url)
    const logPrefix = `请求${rUrl}`

    let param: FetcherProperty['requestOption'] = {
      formData: req || {},
      ...requestOption
    }
    if (requestOption) {
      param = extend<FetcherProperty['requestOption'], FetcherOption['requestOption']>(
        param,
        option
      )
    }

    return new Promise<O>((resolve, reject) => {
      request.post(rUrl, param, (err, res, body) => {
        if (!err) {
          if (res.statusCode === 200) {
            try {
              resolve(JSON.parse(body))
            } catch (er) {
              reject(new Error(`${logPrefix}失败: parse error: ${body}`))
            }
          } else {
            reject(new Error(`${logPrefix}失败: 状态非 200: ${res.statusCode}`))
          }
        } else {
          reject(err)
        }
      })
    })
  }
}
