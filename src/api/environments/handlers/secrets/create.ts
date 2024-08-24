import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { CreateSecretsError } from '../../../../types/errors/secrets'
import { CreateSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type CreateSecretsData = Array<{
  key: Uppercase<string>
  value: string
  description?: string
}>

async function createSecrets(
  envClient: HttpClient,
  data: CreateSecretsData
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  try {
    type NewType = CreateSecretsResData

    const resData = await envClient.post<NewType>({
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
