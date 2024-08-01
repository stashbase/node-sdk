import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type DeleteSecretsResponseData = {
  deletedCount: number
  notFound?: Array<Uppercase<string>>
}

async function deleteEnvironmentSecrets(
  client: HttpClient,
  keys: Uppercase<string>[]
): Promise<ApiResponse<DeleteSecretsResponseData, DeleteSecretsError>> {
  try {
    const data = await client.post<DeleteSecretsResponseData>({
      path: '/secrets/delete',
      data: {
        keys,
      },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteEnvironmentSecrets }
