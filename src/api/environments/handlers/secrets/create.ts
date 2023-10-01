import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type CreateSecretsResponseData = {
  createdCount: number
  duplicateKeys?: string[]
}

type CreateSecretsError = ApiError<
  'no_values_provided' | 'unauthorized' | 'invalid_token' | 'token_expired' | 'invalid_grant'
>

export type CreateSecretsData = Array<{
  key: string
  value: string
  description?: string
}>

async function createSecrets(
  envClient: HttpClient,
  data: CreateSecretsData
): Promise<ApiResponse<CreateSecretsResponseData, CreateSecretsError>> {
  try {
    const secrets = await envClient.post<CreateSecretsResponseData>({
      path: '/secrets',
      data,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { createSecrets }
