import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../errors'
import { ApiError, ApiResponse, responseSuccess } from '../../../http/response'

interface Environment {
  projectName: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  name: string
  createdAt: string
  description: string | null
}

// type GetEnvironmentError = ApiError<EnvironmentApiError>
type GetEnvironmentError = ApiError

async function getEnvironment(
  client: HttpClient
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  // const printTable = options?.printTable

  try {
    const data = await client.get<Environment>({
      path: '/',
    })

    // if (printTable) {
    //   printSecretsTable({ array: secrets })
    // }

    return responseSuccess(data)
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
