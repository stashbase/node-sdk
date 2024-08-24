import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../types/util'
import { createApiErrorFromResponse } from '../../../../errors'
import { UpdateSecretsResData } from '../../../../types/secrets'
import { UpdateSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

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
): Promise<ApiResponse<UpdateSecretsResData, UpdateSecretsError>> {
  try {
    const resData = await envClient.patch<UpdateSecretsResData>({
      path: '/v1/secrets',
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { updateSecrets }
