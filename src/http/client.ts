import fetchWithRetry from './retry'

const baseURL: string = 'http://0.0.0.0:8080/api/v1/sdk/'

type BasePath = 'environments' | 'projects'

type RequestWithData = { path: string; data: { [key: string]: any } | any[] }

export type HttpClient = {
  get: <T>(args: { path: string; query?: { [key: string]: string } }) => Promise<T>
  post: <T>(args: RequestWithData) => Promise<T>
  patch: <T>(args: RequestWithData) => Promise<T>
}

export function createHttpClient(args: {
  basePath: BasePath
  version?: string
  authorization: {
    envToken?: string
  }
}): HttpClient {
  const {
    basePath,
    authorization: { envToken },
  } = args

  const headers = {
    Authorization: envToken ? `EnvToken ${envToken}` : '', // TODO: auth
    'Content-Type': 'application/json',
    'User-Agent': 'EnvEase SDK/0.0.1',
  }

  async function get<T>(args: { path: string; query?: { [key: string]: string } }): Promise<T> {
    let url = `${baseURL}${basePath}${args.path ?? ''}`

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
        console.log('HERE')
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

  async function post<T>(args: { path: string; data: { [key: string]: any } | any[] }): Promise<T> {
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
    data: { [key: string]: any } | any[]
  }): Promise<T> {
    return await postOrPatch<T>({
      method: 'PATCH',
      headers,
      basePath,
      path: args.path,
      data: args.data,
    })
  }

  return {
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
  data: { [key: string]: any } | any[]
}): Promise<T> {
  const { method, basePath, headers, path, data } = args

  const url = `${baseURL}${basePath}${path ?? ''}`

  try {
    const response = await fetchWithRetry(url, {
      method,
      headers,
      body: JSON.stringify(data),
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
