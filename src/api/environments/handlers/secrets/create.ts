import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { CreateSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

interface CreateSecretsResponseData {
  createdCount: number
  duplicateSecrets: Array<SecretKey>
}

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
    const resData = await envClient.post<CreateSecretsResponseData>({
      path: '/v1/secrets',
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { createSecrets }
