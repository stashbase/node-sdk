import fetchWithRetry from './retry'

const baseURL: string = 'http://0.0.0.0:8080/api/v1/sdk'

type BasePath = 'environments' | 'projects' | ''

type RequestWithData = { path: string; data?: { [key: string]: any } | any[] }

export type HttpClient = {
  get: <T>(args: { path: string; query?: { [key: string]: string } }) => Promise<T>
  del: <T>(args: { path: string; query?: { [key: string]: string } }) => Promise<T>

  post: <T>(args: RequestWithData) => Promise<T>
  patch: <T>(args: RequestWithData) => Promise<T>
}

export function createHttpClient(args: {
  basePath: BasePath
  version?: string
  authorization: {
    envApiKey?: string
    workspaceApiKey?: string
  }
}): HttpClient {
  const {
    basePath,
    authorization: { envApiKey, workspaceApiKey },
  } = args

  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'EnvEase SDK/0.0.1',
  } as Record<string, string>

  if (envApiKey) {
    headers['x-env-key'] = envApiKey
  }

  if (workspaceApiKey) {
    // headers['x-admin-token'] = workspaceToken
    headers['x-workspace-key'] = workspaceApiKey
  }

  async function get<T>(args: { path: string; query?: { [key: string]: string } }): Promise<T> {
    let url = `${baseURL}${basePath === '' ? '' : `/${basePath}`}${args.path ?? ''}`

    if (args.query) {
      const query = args.query

      let queryString = Object.keys(query)
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
        if (response.status === 500 || response.status === 404) {
          throw new Error('Internal Server Error')
        } else {
          // TODO: errors
          const errorData = await response.json() // Parse error response
          throw errorData // Throw the entire error response object
        }
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
    return await postOrPatch<T>({
      method: 'POST',
      headers,
      basePath,
      path: args.path,
      data: args.data,
    })
  }

  async function patch<T>(args: {
    path: string
    data?: { [key: string]: any } | any[]
  }): Promise<T> {
    let reqHeaders = headers

    if (!args.data) {
      delete reqHeaders['Content-Type']
    }

    return await postOrPatch<T>({
      method: 'PATCH',
      headers: reqHeaders,
      basePath,
      path: args.path,
      data: args.data,
    })
  }

  async function del<T>(args: { path: string; query?: { [key: string]: string } }): Promise<T> {
    let url = `${baseURL}${basePath === '' ? '' : `/${basePath}`}${args.path ?? ''}`

    if (args.query) {
      const query = args.query

      let queryString = Object.keys(query)
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
        if (response.status === 500 || response.status === 404) {
          throw new Error('Internal Server Error')
        } else {
          // TODO: errors
          const errorData = await response.json() // Parse error response
          throw errorData // Throw the entire error response object
        }
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
    post,
    patch,
  }
}

async function postOrPatch<T>(args: {
  method: 'POST' | 'PATCH'
  headers: Record<string, string>
  basePath: string
  path: string
  data?: { [key: string]: any } | any[]
}): Promise<T> {
  const { method, basePath, headers, path, data } = args

  // const url = `${baseURL}${basePath == '' ? '' : basePath}${path ?? ''}`
  const url = `${baseURL}${basePath === '' ? '' : `/${basePath}`}${path ?? ''}`
  console.log(url)

  try {
    const response = await fetchWithRetry(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
      if (response.status === 500 || response.status === 404) {
        throw new Error('Internal Server Error')
      } else {
        const errorData = await response.json() // Parse error response
        console.error(errorData)
        throw errorData // Throw the entire error response object
      }
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
