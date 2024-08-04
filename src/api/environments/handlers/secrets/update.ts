import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../types/util'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { UpdateSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

interface UpdateSecretsResponseData {
  updatedCount: number
  notFoundSecrets: Array<SecretKey>
}

export type UpdateSecretsData = Array<
  {
    key: Uppercase<string>
  } & AtLeastOne<{
    newKey: Uppercase<string>
    value: string
    description: string | null
  }>
>

async function updateSecrets(
  envClient: HttpClient,
  data: UpdateSecretsData
): Promise<ApiResponse<UpdateSecretsResponseData, UpdateSecretsError>> {
  try {
    const resData = await envClient.patch<UpdateSecretsResponseData>({
      path: '/secrets',
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { updateSecrets }
