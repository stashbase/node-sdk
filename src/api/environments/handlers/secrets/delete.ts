import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { ApiError, ApiResponse } from '../../../../http/response'
import { SecretsApiError } from '../../errors/secrets'

type DeleteSecretsError = ApiError<SecretsApiError>

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

    return { data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { deleteEnvironmentSecrets }
