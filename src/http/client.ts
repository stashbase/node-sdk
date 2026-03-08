import fetchWithRetry from './retry'
import { createApiErrorFromResponse } from '../errors'
import { responseFailure, responseSuccess } from './response'
import { toCamelCase, toSnakeCase } from '../utils/serializer'

declare const __SDK_VERSION__: string

export const DEFAULT_API_BASE_URL = 'https://api.stashbase.dev'
export const DEFAULT_API_TIMEOUT_MS = 15000
const VERSION = __SDK_VERSION__
const DEV_API_URL_ENV = 'STASHBASE_SDK_DEV_API_URL'
const DEV_MODE_ENV = 'STASHBASE_SDK_DEV_MODE'

export type HttpClientConfig = {
  baseUrl?: string
  version?: string
  timeoutMs?: number
}

type RequestWithData = {
  path: string
  data?: { [key: string]: any } | any[]
  timeoutMs?: number
  signal?: AbortSignal
}
type Query = Record<string, string | number | boolean>

export class HttpClient {
  private headers: Record<string, string>
  private baseUrl: string
  private timeoutMs?: number

  constructor(args: {
    baseUrl?: string
    version?: string
    timeoutMs?: number
    authorization: {
      apiKey: string
    }
  }) {
    const {
      authorization: { apiKey },
      version,
      baseUrl,
      timeoutMs,
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
    this.timeoutMs = timeoutMs ?? DEFAULT_API_TIMEOUT_MS
  }

  private async get<T>(args: { path: string; query?: Query; timeoutMs?: number; signal?: AbortSignal }): Promise<T> {
    let url = `${this.baseUrl}${args.path ?? ''}`

    if (args.query) {
      const query = args.query
      const queryString = Object.keys(query)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&')
      url += '?' + queryString
    }

    try {
      const response = await fetchWithRetry(url, {
        method: 'GET',
        headers: this.headers,
      }, {
        timeoutMs: args.timeoutMs ?? this.timeoutMs,
        signal: args.signal,
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
      if (error instanceof Error) {
        throw error
      } else {
        throw error
      }
    }
  }

  private async delete<T>(args: {
    path: string
    query?: Query
    timeoutMs?: number
    signal?: AbortSignal
  }): Promise<T> {
    let url = `${this.baseUrl}${args.path ?? ''}`

    if (args.query) {
      const query = args.query
      const queryString = Object.keys(query)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
        .join('&')
      url += '?' + queryString
    }

    try {
      const response = await fetchWithRetry(url, {
        method: 'DELETE',
        headers: this.headers,
      }, {
        timeoutMs: args.timeoutMs ?? this.timeoutMs,
        signal: args.signal,
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
      if (error instanceof Error) {
        throw error
      } else {
        throw error
      }
    }
  }

  private async put<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'PUT',
      headers: this.headers,
      path: args.path,
      data: args.data,
      timeoutMs: args.timeoutMs,
      signal: args.signal,
    })
  }

  private async post<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'POST',
      headers: this.headers,
      path: args.path,
      data: args.data,
      timeoutMs: args.timeoutMs,
      signal: args.signal,
    })
  }

  private async patch<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'PATCH',
      headers: this.headers,
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
          headers: this.headers,
          timeoutMs,
          signal,
        })
      }

      const formattedResponse = toCamelCase(response)
      return responseSuccess(formattedResponse)
    } catch (error) {
      const formattedError = toCamelCase(error)
      const apiError = createApiErrorFromResponse<E>(formattedError)
      return responseFailure(apiError)
    }
  }

  private async requestWithData<T>(args: {
    method: 'POST' | 'PATCH' | 'PUT'
    headers: Record<string, string>
    path: string
    data?: { [key: string]: any } | any[]
    timeoutMs?: number
    signal?: AbortSignal
  }): Promise<T> {
    const { method, headers, path, data, timeoutMs, signal } = args
    const url = `${this.baseUrl}${path ?? ''}`

    const formattedData = data ? toSnakeCase(data) : undefined

    try {
      const response = await fetchWithRetry(url, {
        method,
        headers,
        body: formattedData ? JSON.stringify(formattedData) : undefined,
      }, {
        timeoutMs: timeoutMs ?? this.timeoutMs,
        signal,
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
      if (error instanceof Error) {
        throw error
      } else {
        throw error
      }
    }
  }
}

export function createHttpClient(args: {
  baseUrl?: string
  version?: string
  timeoutMs?: number
  authorization: {
    apiKey: string
  }
}): HttpClient {
  return new HttpClient(args)
}

const normalizeBaseUrl = (url: string): string => {
  return url.replace(/\/+$/, '')
}

const resolveBaseUrl = (baseUrl?: string): string => {
  if (baseUrl && baseUrl.trim().length > 0) {
    return normalizeBaseUrl(baseUrl.trim())
  }

  if (typeof process !== 'undefined') {
    const isDevMode = process.env.NODE_ENV !== 'production' || process.env[DEV_MODE_ENV] === '1'
    const devUrl = process.env[DEV_API_URL_ENV]

    if (isDevMode && devUrl && devUrl.trim().length > 0) {
      return normalizeBaseUrl(devUrl)
    }
  }

  return DEFAULT_API_BASE_URL
}
