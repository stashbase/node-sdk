const baseURL: string = 'http://0.0.0.0:8080/api/v1/sdk/'

type BasePath = 'environments' | 'projects'

export type HttpClient = {
  get: <T>(args: { path: string; query?: { [key: string]: string } }) => Promise<T>
  post: <T>(args: { path: string; data: { [key: string]: any } | any[] }) => Promise<T>
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
      const response = await fetch(url, {
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

  async function post<T>(args: { path: string; data: { [key: string]: any } | any[] }): Promise<T> {
    const { path, data } = args

    const url = `${baseURL}${basePath}${path ?? ''}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        if (response.status === 500 || response.status === 404) {
          throw new Error('Internal Server Error')
        } else {
          // TODO: errors
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

  return {
    get,
    post,
  }
}
