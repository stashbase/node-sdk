import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../utils/types'
import { createApiErrorFromResponse } from '../../../../errors'
import { UpdateSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
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
    const secrets = await envClient.patch<UpdateSecretsResponseData>({
      path: '/secrets',
      data,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { updateSecrets }
