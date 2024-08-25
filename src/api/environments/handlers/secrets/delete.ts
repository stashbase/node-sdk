import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteSecretsError } from '../../../../types/errors/secrets'
import { DeleteSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function deleteEnvironmentSecrets(
  client: HttpClient,
  keys: Uppercase<string>[]
): Promise<ApiResponse<DeleteSecretsResData, DeleteSecretsError>> {
  try {
    const data = await client.post<DeleteSecretsResData>({
      path: '/v1/secrets/delete',
      data: keys,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteEnvironmentSecrets }
