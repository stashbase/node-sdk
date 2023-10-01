import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

export interface ListSecretsOpts {
  description?: boolean
}

type SecretsData = Array<{ key: string; value: string; description?: string }>

type ListSecretsError = ApiError<
  'unauthorized' | 'invalid_token' | 'token_expired' | 'invalid_grant'
>

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOpts
): Promise<ApiResponse<SecretsData, ListSecretsError>> {
  const returnDescription = options?.description

  try {
    const secrets = await envClient.get<SecretsData>({
      path: '/secrets/list',
      query: returnDescription ? { description: 'true' } : undefined,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { listSecrets }
