import fetchWithRetry from './retry'
import { createApiErrorFromResponse } from '../errors'
import { responseFailure, responseSuccess } from './response'
import { toCamelCase, toSnakeCase } from '../utils/serializer'

declare const __SDK_VERSION__: string
declare const __SDK_DEV_API_URL__: string

export const DEFAULT_API_BASE_URL = 'https://api.stashbase.dev'
export const DEFAULT_API_TIMEOUT_MS = 10000
export const MAX_API_TIMEOUT_MS = 10000
export const DEFAULT_API_RETRIES = 3
export const MAX_API_RETRIES = 10
const VERSION = __SDK_VERSION__

export type HttpRequestMethod = 'GET' | 'DELETE' | 'POST' | 'PATCH' | 'PUT'
type Query = Record<string, string | number | boolean>
type RequestData = { [key: string]: any } | any[]

export type HttpRequestHookContext = {
  method: HttpRequestMethod
  path: string
  url: string
  headers: Record<string, string>
  timeoutMs?: number
  signal?: AbortSignal
  query?: Query
  data?: unknown
}

export type HttpBeforeRequestHookContext = HttpRequestHookContext
export type HttpAfterResponseHookContext = HttpRequestHookContext & { response: Response }
export type HttpErrorHookContext = HttpRequestHookContext & { error: unknown }

export type HttpClientHooks = {
  beforeRequest?: (context: HttpBeforeRequestHookContext) => void | Promise<void>
  afterResponse?: (context: HttpAfterResponseHookContext) => void | Promise<void>
  onError?: (context: HttpErrorHookContext) => void | Promise<void>
}

export type HttpHookName = keyof HttpClientHooks

export class HookExecutionError extends Error {
  public readonly hook: HttpHookName
  public readonly originalError: unknown

  constructor(hook: HttpHookName, originalError: unknown) {
    const causeMessage = originalError instanceof Error ? originalError.message : 'Unknown hook error'
    super(`Transport hook "${hook}" failed: ${causeMessage}`)
    this.name = 'HookExecutionError'
    this.hook = hook
    this.originalError = originalError
  }
}

export type HttpClientConfig = {
  baseUrl?: string
  version?: string
  timeoutMs?: number
  retries?: number
  hooks?: HttpClientHooks
}

type RequestWithData = {
  path: string
  data?: RequestData
  timeoutMs?: number
  signal?: AbortSignal
}

export class HttpClient {
  private headers: Record<string, string>
  private baseUrl: string
  private timeoutMs?: number
  private retries: number
  private hooks?: HttpClientHooks

  constructor(args: {
    baseUrl?: string
    version?: string
    timeoutMs?: number
    retries?: number
    hooks?: HttpClientHooks
    authorization: {
      apiKey: string
    }
  }) {
    const {
      authorization: { apiKey },
      version,
      baseUrl,
      timeoutMs,
      retries,
      hooks,
    } = args

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': `stashbase/node-sdk/${version ?? VERSION}`,
    } as Record<string, string>

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    this.headers = headers
    this.baseUrl = resolveBaseUrl(baseUrl)
    this.timeoutMs = normalizeTimeoutMs(timeoutMs)
    this.retries = normalizeRetries(retries)
    this.hooks = hooks
  }

  public getHooks(): HttpClientHooks | undefined {
    return this.hooks
  }

  public setHooks(hooks?: HttpClientHooks): void {
    this.hooks = hooks
  }

  private buildUrl(path: string, query?: Query): string {
    let url = `${this.baseUrl}${path ?? ''}`

    if (query) {
      const queryString = Object.keys(query)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&')
      url += '?' + queryString
    }

    return url
  }

  private async triggerBeforeRequest(context: HttpBeforeRequestHookContext): Promise<void> {
    if (!this.hooks?.beforeRequest) {
      return
    }

    try {
      await this.hooks.beforeRequest(context)
    } catch (error) {
      throw this.createHookExecutionError('beforeRequest', error)
    }
  }

  private async triggerAfterResponse(context: HttpAfterResponseHookContext): Promise<void> {
    if (!this.hooks?.afterResponse) {
      return
    }

    try {
      await this.hooks.afterResponse(context)
    } catch (error) {
      throw this.createHookExecutionError('afterResponse', error)
    }
  }

  private async triggerOnError(context: HttpErrorHookContext): Promise<void> {
    if (!this.hooks?.onError) {
      return
    }

    try {
      await this.hooks.onError(context)
    } catch (_hookError) {
      // Keep original request error untouched.
    }
  }

  private createHookExecutionError(hook: HttpHookName, cause: unknown): HookExecutionError {
    return new HookExecutionError(hook, cause)
  }

  private async get<T>(args: { path: string; query?: Query; timeoutMs?: number; signal?: AbortSignal }): Promise<T> {
    const timeoutMs = args.timeoutMs ?? this.timeoutMs
    const url = this.buildUrl(args.path, args.query)
    const hookContext: HttpRequestHookContext = {
      method: 'GET',
      path: args.path,
      url,
      headers: { ...this.headers },
      query: args.query,
      timeoutMs,
      signal: args.signal,
    }

    try {
      await this.triggerBeforeRequest(hookContext)

      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: this.headers,
      }, {
        retries: this.retries,
        timeoutMs,
        signal: args.signal,
      })

      await this.triggerAfterResponse({
        ...hookContext,
        response,
      })

      if (!response.ok) {
        if (response.status === 503) {
          const error = new Error()
          error.name = 'ServerTemporaryUnavailableError'
          throw error
        }

        const errorData: unknown = await response.json()
        throw errorData
      }

      const data: unknown = await response.json()
      return data as T
    } catch (error) {
      await this.triggerOnError({
        ...hookContext,
        error,
      })
      throw error
    }
  }

  private async delete<T>(args: {
    path: string
    query?: Query
    timeoutMs?: number
    signal?: AbortSignal
  }): Promise<T> {
    const timeoutMs = args.timeoutMs ?? this.timeoutMs
    const url = this.buildUrl(args.path, args.query)
    const hookContext: HttpRequestHookContext = {
      method: 'DELETE',
      path: args.path,
      url,
      headers: { ...this.headers },
      query: args.query,
      timeoutMs,
      signal: args.signal,
    }

    try {
      await this.triggerBeforeRequest(hookContext)

      const response = await fetchWithRetry(url, {
        method: 'DELETE',
        headers: this.headers,
      }, {
        retries: this.retries,
        timeoutMs,
        signal: args.signal,
      })

      await this.triggerAfterResponse({
        ...hookContext,
        response,
      })

      if (!response.ok) {
        if (response.status === 503) {
          const error = new Error()
          error.name = 'ServerTemporaryUnavailableError'
          throw error
        }

        const errorData: unknown = await response.json()
        throw errorData
      }

      if (response.status === 204) {
        return null as T
      }

      const data: unknown = await response.json()
      return data as T
    } catch (error) {
      await this.triggerOnError({
        ...hookContext,
        error,
      })
      throw error
    }
  }

  private async put<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'PUT',
      path: args.path,
      data: args.data,
      timeoutMs: args.timeoutMs,
      signal: args.signal,
    })
  }

  private async post<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'POST',
      path: args.path,
      data: args.data,
      timeoutMs: args.timeoutMs,
      signal: args.signal,
    })
  }

  private async patch<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'PATCH',
      path: args.path,
      data: args.data,
      timeoutMs: args.timeoutMs,
      signal: args.signal,
    })
  }

  public async sendApiRequest<T = object, E = object>(args: {
    method: 'GET' | 'DELETE' | 'POST' | 'PATCH' | 'PUT'
    path: string
    data?: { [key: string]: any } | any[]
    query?: Record<string, string | number | boolean>
    timeoutMs?: number
    signal?: AbortSignal
  }) {
    const { method, path, data, query, timeoutMs, signal } = args
    try {
      let response: T

      if (method === 'GET' || method === 'DELETE') {
        const m = method === 'GET' ? 'get' : 'delete'
        response = await this[m]<T>({ path, query, timeoutMs, signal })
      } else {
        response = await this.requestWithData<T>({
          method,
          path,
          data,
          timeoutMs,
          signal,
        })
      }

      const formattedResponse = toCamelCase(response)
      return responseSuccess(formattedResponse)
    } catch (error) {
      if (error instanceof HookExecutionError) {
        return responseFailure(error as E)
      }

      const formattedError = toCamelCase(error)
      const apiError = createApiErrorFromResponse<E>(formattedError)
      return responseFailure(apiError)
    }
  }

  private async requestWithData<T>(args: {
    method: 'POST' | 'PATCH' | 'PUT'
    path: string
    data?: RequestData
    timeoutMs?: number
    signal?: AbortSignal
  }): Promise<T> {
    const { method, path, data, signal } = args
    const timeoutMs = args.timeoutMs ?? this.timeoutMs
    const url = this.buildUrl(path)

    const formattedData = data ? toSnakeCase(data) : undefined
    const hookContext: HttpRequestHookContext = {
      method,
      path,
      url,
      headers: { ...this.headers },
      timeoutMs,
      signal,
      data: formattedData,
    }

    try {
      await this.triggerBeforeRequest(hookContext)

      const response = await fetchWithRetry(url, {
        method,
        headers: this.headers,
        body: formattedData ? JSON.stringify(formattedData) : undefined,
      }, {
        retries: this.retries,
        timeoutMs,
        signal,
      })

      await this.triggerAfterResponse({
        ...hookContext,
        response,
      })

      if (!response.ok) {
        if (response.status === 503) {
          const error = new Error()
          error.name = 'ServerTemporaryUnavailableError'
          throw error
        }

        const errorData: unknown = await response.json()
        throw errorData
      }

      if (response.status === 204) {
        return null as T
      }

      const responseData: unknown = await response.json()
      return responseData as T
    } catch (error) {
      await this.triggerOnError({
        ...hookContext,
        error,
      })
      throw error
    }
  }
}

export function createHttpClient(args: HttpClientConfig & {
  authorization: {
    apiKey: string
  }
}): HttpClient {
  return new HttpClient(args)
}

const normalizeTimeoutMs = (timeoutMs?: number): number => {
  if (typeof timeoutMs !== 'number' || !Number.isFinite(timeoutMs)) {
    return DEFAULT_API_TIMEOUT_MS
  }

  const integerTimeout = Math.trunc(timeoutMs)
  return Math.min(MAX_API_TIMEOUT_MS, Math.max(1, integerTimeout))
}

const normalizeRetries = (retries?: number): number => {
  if (typeof retries !== 'number' || !Number.isFinite(retries)) {
    return DEFAULT_API_RETRIES
  }

  const integerRetries = Math.trunc(retries)
  return Math.min(MAX_API_RETRIES, Math.max(1, integerRetries))
}

const normalizeBaseUrl = (url: string): string => {
  return url.replace(/\/+$/, '')
}

const resolveBaseUrl = (baseUrl?: string): string => {
  if (baseUrl && baseUrl.trim().length > 0) {
    return normalizeBaseUrl(baseUrl.trim())
  }

  const devUrl = __SDK_DEV_API_URL__
  if (typeof devUrl === 'string' && devUrl.trim().length > 0) {
    return normalizeBaseUrl(devUrl)
  }

  return DEFAULT_API_BASE_URL
}
