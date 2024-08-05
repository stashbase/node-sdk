import { HttpClient } from '../../../../http/client'
import { GenericApiError } from '../../../../types/errors'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type DeleteAllSecretsError = GenericApiError

interface DeleteAllSecretsResponseData {
  deletedCount: number
}

async function deleteAllEnvironmentSecrets(
  client: HttpClient
): Promise<ApiResponse<DeleteAllSecretsResponseData, DeleteAllSecretsError>> {
  try {
    const data = await client.del<DeleteAllSecretsResponseData>({
      path: '/v1/secrets/all',
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteAllSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteAllEnvironmentSecrets }
