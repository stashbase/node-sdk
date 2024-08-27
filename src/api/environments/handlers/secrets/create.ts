import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { CreateSecretsError } from '../../../../types/errors/secrets'
import { CreateSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type CreateManySecretsData = Array<{
  key: Uppercase<string>
  value: string
  description?: string | null
}>

async function createSecrets(
  envClient: HttpClient,
  data: CreateManySecretsData
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  try {
    const resData = await envClient.post<CreateSecretsResData>({
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
