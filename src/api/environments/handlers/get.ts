import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../errors'
import { GenericApiError } from '../../../types/errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'

interface Environment {
  id: string
  createdAt: string
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  description: string | null
  secretCount: number
  project: {
    id: string
    name: string
  }
}

// type GetEnvironmentError = ApiError<EnvironmentApiError>
type GetEnvironmentError = GenericApiError

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
