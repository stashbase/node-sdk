import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { SecretsApiError } from '../../errors/secrets'

type Secret = { key: Uppercase<string>; value: string; description?: string }

type GetSecretError = ApiError<SecretsApiError | 'secret_not_found'>
type GetSecretResponse = Promise<ApiResponse<Secret, GetSecretError>>

async function getSecret(envClient: HttpClient, key: string): GetSecretResponse {
  try {
    const secrets = await envClient.get<Secret>({
      path: `/secrets/${key}`,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetSecretError>(error)

    return { data: null, error: apiError }
  }
}

export { getSecret }
