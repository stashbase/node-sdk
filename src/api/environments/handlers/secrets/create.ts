import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type CreateSecretsResponseData = {
  createdCount: number
  duplicateKeys?: Array<Uppercase<string>>
}

type CreateSecretsError = ApiError<'duplicate_keys'> | ApiError<'self_referencing_secrets'>

export type CreateSecretsData = Array<{
  key: Uppercase<string>
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
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { createSecrets }
