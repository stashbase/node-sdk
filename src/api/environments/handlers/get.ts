import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../errors'
import { SharedApiError } from '../../../types/errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'

interface Environment {
  projectName: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  name: string
  createdAt: string
  description: string | null
}

// type GetEnvironmentError = ApiError<EnvironmentApiError>
type GetEnvironmentError = SharedApiError

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
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { getEnvironment }
