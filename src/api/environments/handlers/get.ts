import { HttpClient } from '../../../http/client'
import { GenericApiError } from '../../../types/errors'
import { createApiErrorFromResponse } from '../../../errors'
import { EnvironmentWithProject } from '../../../types/environments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'

type GetEnvironmentError = GenericApiError

async function getEnvironment(
  client: HttpClient
): Promise<ApiResponse<EnvironmentWithProject, GetEnvironmentError>> {
  // const printTable = options?.printTable

  try {
    const data = await client.get<EnvironmentWithProject>({
      path: '/v1/environment',
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
