import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { AtLeastOne } from '../../../../utils/types'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
}

type UpdateSecretsError =
  | ApiError<
      | 'no_values_provided'
      | 'missing_properties'
      | 'duplicate_new_keys'
      | 'self_referencing_secrets'
    >
  | AlreadyExistApiError

type AlreadyExistApiError = ApiError<
  'new_keys_already_exist',
  {
    /**
     * @summary Secret key that already exist
     * @returns Uppercase Uppercase<string>
     * */
    alreadyExist: Uppercase<string>
  }
>

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

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { updateSecrets }
