# yyl-ssr-fetcher

用于 服务端 请求

## 安装

```bash
# yarn
yarn add yyl-ssr-fetcher

# npm
npm i yyl-ssr-fetcher --save
```

## usage

```typescript
import { Fetcher } from 'yyl-ssr-fetcher'

interface Req {
  a: number
}

interface Res {}

const fetcher = new Fetcher({ timeout: 2000 })

fetcher
  .get<Req, Res>('path/to/api', { a: 1 })
  .then((rs) => {
    // type Res
  })
```

## types

直接看 types 吧

```typescript
import { CoreOptions } from 'request'
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
/** fetcher 属性 */
export declare type FetcherProperty = Required<FetcherOption>
/** fetcher 主函数 */
export declare class Fetcher {
  /** 超时时间 */
  private timeout
  /** 请求ua */
  private userAgent
  /** request 配置 */
  private requestOption
  /** 默认 protocol */
  private defaultProtocol
  constructor(option?: FetcherOption)
  /** url 格式化 */
  private formatUrl
  /** get 请求 */
  get<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>
  /** post 请求 */
  post<I = {}, O = {}>(url: string, req?: I, option?: FetcherOption['requestOption']): Promise<O>
}
```
