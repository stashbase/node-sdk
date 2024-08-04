import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { SetSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

interface SetSecretsResponseData {
  createdCount: number
  updatedCount: number
}

export type SetSecretsData = Array<{
  key: Uppercase<string>
  value: string
  description?: string | null
}>

async function setSecrets(
  envClient: HttpClient,
  data: SetSecretsData
): Promise<ApiResponse<SetSecretsResponseData, SetSecretsError>> {
  try {
    const resData = await envClient.post<SetSecretsResponseData>({
      path: '/v1/secrets',
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { setSecrets }
