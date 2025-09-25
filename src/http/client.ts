import fetchWithRetry from './retry'
import { createApiErrorFromResponse } from '../errors'
import { responseFailure, responseSuccess } from './response'

const baseURL: string = 'http://0.0.0.0:5000'
const version: string = '0.0.1'

type RequestWithData = { path: string; data?: { [key: string]: any } | any[] }
type Query = Record<string, string | number | boolean>

export class HttpClient {
  private headers: Record<string, string>

  constructor(args: {
    version?: string
    authorization: {
      apiKey: string
    }
  }) {
    const {
      authorization: { apiKey },
    } = args

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': `stashbase/node-sdk/${version}`,
    } as Record<string, string>

    if (apiKey) {
      headers['x-api-key'] = apiKey
    }

    this.headers = headers
  }

  private async get<T>(args: { path: string; query?: Query }): Promise<T> {
    let url = `${baseURL}${args.path ?? ''}`

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
      })

      if (!response.ok) {
        const errorData: unknown = await response.json()
        throw errorData
      }

      const data: unknown = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof Error) {
        console.error('A network-related error occurred:', error.message)
        throw error
      } else {
        throw error
      }
    }
  }

  private async delete<T>(args: { path: string; query?: Query }): Promise<T> {
    let url = `${baseURL}${args.path ?? ''}`

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
      })

      if (!response.ok) {
        const errorData: unknown = await response.json()
        throw errorData
      }

      if (response.status === 204) {
        console.log('No content')
        return null as T
      }

      const data: unknown = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof Error) {
        console.error('A network-related error occurred:', error.message)
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
    })
  }

  private async post<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'POST',
      headers: this.headers,
      path: args.path,
      data: args.data,
    })
  }

  private async patch<T>(args: RequestWithData): Promise<T> {
    return await this.requestWithData<T>({
      method: 'PATCH',
      headers: this.headers,
      path: args.path,
      data: args.data,
    })
  }

  public async sendApiRequest<T = object, E = object>(args: {
    method: 'GET' | 'DELETE' | 'POST' | 'PATCH' | 'PUT'
    path: string
    data?: { [key: string]: any } | any[]
    query?: Record<string, string | number | boolean>
  }) {
    const { method, path, data, query } = args
    try {
      let response: T

      if (method === 'GET' || method === 'DELETE') {
        const m = method === 'GET' ? 'get' : 'delete'
        response = await this[m]<T>({ path, query })
      } else {
        response = await this.requestWithData<T>({ method, path, data, headers: this.headers })
      }

      return responseSuccess(response)
    } catch (error) {
      const apiError = createApiErrorFromResponse<E>(error)
      return responseFailure(apiError)
    }
  }

  private async requestWithData<T>(args: {
    method: 'POST' | 'PATCH' | 'PUT'
    headers: Record<string, string>
    path: string
    data?: { [key: string]: any } | any[]
  }): Promise<T> {
    const { method, headers, path, data } = args
    const url = `${baseURL}${path ?? ''}`
    console.log(url)

    try {
      const response = await fetchWithRetry(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      })

      if (!response.ok) {
        const errorData: unknown = await response.json()
        console.error(errorData)
        throw errorData
      }

      if (response.status === 204) {
        console.log('No content')
        return null as T
      }

      const responseData: unknown = await response.json()
      return responseData as T
    } catch (error) {
      if (error instanceof Error) {
        console.error('A network-related error occurred:', error.message)
        throw error
      } else {
        throw error
      }
    }
  }
}

export function createHttpClient(args: {
  version?: string
  authorization: {
    apiKey: string
  }
}): HttpClient {
  return new HttpClient(args)
}
