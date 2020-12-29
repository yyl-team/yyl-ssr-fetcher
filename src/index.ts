import request, { CoreOptions } from 'request'
import extend from 'extend'

/** 日志类型 */
export enum LogType {
  Info = 'info',
  Success = 'success',
  Warn = 'warn',
  Error = 'error'
}

/** 日志参数 */
export interface LogProps {
  /** 日志类型 */
  type: LogType
  /** 日志来源 */
  path: string
  /** 日志内容 */
  args: any[]
}

/** request 配置 */
export interface RequestOption extends CoreOptions {
  /** 请求来源-用于logger */
  ref?: string
}
/** fetcher 配置 */
export interface FetcherOption {
  /** 超时设置 */
  timeout?: number
  /** 超时设置 */
  userAgent?: string
  /** request 配置 */
  requestOption?: RequestOption
  /** 默认请求协议 */
  defaultProtocol?: string
  /** 日志 */
  logger?: (props: LogProps) => void
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
  /** 默认logger */
  private logger: FetcherProperty['logger'] = () => {}
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

    // logger 初始化
    if (option?.logger) {
      this.logger = option.logger
    }
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
    const start = +new Date()
    const { requestOption } = this
    const rUrl = this.formatUrl(url)
    const logPrefix = `请求${rUrl}`
    const ref = option?.ref || rUrl

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
      this.logger({
        path: ref,
        type: LogType.Info,
        args: [logPrefix, '类型 GET', '参数', param]
      })
      request.get(rUrl, param, (err, res, body) => {
        const cost = +new Date() - start
        if (!err) {
          if (res.statusCode === 200) {
            try {
              const r = JSON.parse(body)
              this.logger({
                path: ref,
                type: LogType.Success,
                args: [`${logPrefix} 成功(${cost}ms)`, '返回值', r]
              })
              resolve(r)
            } catch (er) {
              const errMsg = `parse error: ${body}`
              this.logger({
                path: ref,
                type: LogType.Error,
                args: [`${logPrefix} 失败`, errMsg]
              })
              reject(new Error(`${logPrefix}失败: ${errMsg}`))
            }
          } else {
            const errMsg = `状态非 200: ${res.statusCode}`
            this.logger({
              path: ref,
              type: LogType.Error,
              args: [`${logPrefix} 失败`, errMsg]
            })
            reject(new Error(`${logPrefix}失败: ${errMsg}`))
          }
        } else {
          this.logger({
            path: ref,
            type: LogType.Error,
            args: [`${logPrefix} 失败`, err]
          })
          reject(err)
        }
      })
    })
  }

  /** post 请求 */
  post<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']) {
    const start = +new Date()
    const { requestOption } = this
    const rUrl = this.formatUrl(url)
    const logPrefix = `请求${rUrl}`
    const ref = option?.ref || rUrl

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
      this.logger({
        path: ref,
        type: LogType.Info,
        args: [logPrefix, '类型 Post', '参数', param]
      })

      request.post(rUrl, param, (err, res, body) => {
        const cost = +new Date() - start
        if (!err) {
          if (res.statusCode === 200) {
            try {
              const r = JSON.parse(body)
              this.logger({
                path: ref,
                type: LogType.Success,
                args: [`${logPrefix} 成功(${cost})ms`, '返回值', r]
              })
              resolve(r)
            } catch (er) {
              const errMsg = `parse error: ${body}`
              this.logger({
                path: ref,
                type: LogType.Error,
                args: [`${logPrefix} 失败`, errMsg]
              })
              reject(new Error(`${logPrefix}失败: ${errMsg}`))
            }
          } else {
            const errMsg = `状态非 200: ${res.statusCode}`
            this.logger({
              path: ref,
              type: LogType.Error,
              args: [`${logPrefix} 失败`, errMsg]
            })
            reject(new Error(`${logPrefix}失败: ${errMsg}`))
          }
        } else {
          this.logger({
            path: ref,
            type: LogType.Error,
            args: [`${logPrefix} 失败`, err]
          })
          reject(err)
        }
      })
    })
  }
}
