import fetchWithRetry from './retry'

const baseURL: string = 'http://0.0.0.0:5000'

// type BasePath = 'environments' | 'projects' | ''

type RequestWithData = { path: string; data?: { [key: string]: any } | any[] }

type Query = Record<string, string | number | boolean>

export type HttpClient = {
  get: <T>(args: { path: string; query?: Query }) => Promise<T>
  del: <T>(args: { path: string; query?: Query }) => Promise<T>

  put: <T>(args: RequestWithData) => Promise<T>
  post: <T>(args: RequestWithData) => Promise<T>
  patch: <T>(args: RequestWithData) => Promise<T>
}

export function createHttpClient(args: {
  version?: string
  authorization: {
    envApiKey?: string
    workspaceApiKey?: string
  }
}): HttpClient {
  const {
    authorization: { envApiKey, workspaceApiKey },
  } = args

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'EnvEase SDK/0.0.1',
  } as Record<string, string>

  if (envApiKey) {
    headers['x-api-key'] = envApiKey
  }

  if (workspaceApiKey) {
    // headers['x-admin-token'] = workspaceToken
    headers['x-api-key'] = workspaceApiKey
  }

  async function get<T>(args: { path: string; query?: Query }): Promise<T> {
    // let url = `${baseURL}${basePath === '' ? '' : `/${basePath}`}${args.path ?? ''}`
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
        headers,
      })

      if (!response.ok) {
        // TODO: errors
        const errorData = await response.json() // Parse error response
        throw errorData // Throw the entire error response object
      }

      const data = await response.json()
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

  async function post<T>(args: {
    path: string
    data?: { [key: string]: any } | any[]
  }): Promise<T> {
    const reqHeaders = headers

    if (!args.data) {
      delete reqHeaders['Content-Type']
    }

    return await requestWithData<T>({
      method: 'POST',
      headers: reqHeaders,
      path: args.path,
      data: args.data,
    })
  }

  async function patch<T>(args: {
    path: string
    data?: { [key: string]: any } | any[]
  }): Promise<T> {
    const reqHeaders = headers

    if (!args.data) {
      delete reqHeaders['Content-Type']
    }

    console.log({ reqHeaders })

    return await requestWithData<T>({
      method: 'PATCH',
      headers: reqHeaders,
      path: args.path,
      data: args.data,
    })
  }

  async function put<T>(args: { path: string; data?: { [key: string]: any } | any[] }): Promise<T> {
    const reqHeaders = headers

    if (!args.data) {
      delete reqHeaders['Content-Type']
    }

    return await requestWithData<T>({
      method: 'PUT',
      headers: reqHeaders,
      path: args.path,
      data: args.data,
    })
  }

  async function del<T>(args: { path: string; query?: Query }): Promise<T> {
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
        headers,
      })

      if (!response.ok) {
        // TODO: errors
        const errorData = await response.json() // Parse error response
        throw errorData // Throw the entire error response object
      }

      if (response.status === 204) {
        console.log('No content')
        return null as T
      }

      const data = await response.json()
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

  return {
    del,
    get,
    put,
    post,
    patch,
  }
}

async function requestWithData<T>(args: {
  method: 'POST' | 'PATCH' | 'PUT'
  headers: Record<string, string>
  path: string
  data?: { [key: string]: any } | any[]
}): Promise<T> {
  const { method, headers, path, data } = args

  // const url = `${baseURL}${basePath == '' ? '' : basePath}${path ?? ''}`
  const url = `${baseURL}${path ?? ''}`
  console.log(url)

  try {
    const response = await fetchWithRetry(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json() // Parse error response
      console.error(errorData)
      throw errorData // Throw the entire error response object
    }

    if (response.status === 204) {
      console.log('No content')
      return null as T
    }

    const responseData = await response.json()
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
