import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetSecretError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type Secret = { key: Uppercase<string>; value: string; description?: string }

type GetSecretResponse = Promise<ApiResponse<Secret, GetSecretError>>

async function getSecret(
  envClient: HttpClient,
  key: string,
  expandRefs?: boolean
): GetSecretResponse {
  try {
    const secrets = await envClient.get<Secret>({
      path: `/secrets/${key}`,
      query: expandRefs ? { 'expand-refs': 'true' } : undefined,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getSecret }
