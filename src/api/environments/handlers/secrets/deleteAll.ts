import { HttpClient } from '../../../../http/client'
import { GenericApiError } from '../../../../types/errors'
import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteAllSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type DeleteAllSecretsError = GenericApiError

async function deleteAllEnvironmentSecrets(
  client: HttpClient
): Promise<ApiResponse<DeleteAllSecretsResData, DeleteAllSecretsError>> {
  try {
    const data = await client.post<DeleteAllSecretsResData>({
      path: '/v1/secrets/delete/all',
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteAllSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteAllEnvironmentSecrets }
