import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteSecretsError } from '../../../../types/errors/secrets'

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
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)
    return { data: null, error: apiError }
  }
}

export { deleteEnvironmentSecrets }
