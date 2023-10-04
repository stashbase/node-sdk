import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { SecretsApiError } from '../../errors/secrets'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
}

type UpdateSecretsError = ApiError<SecretsApiError | 'no_values_provided' | 'missing_properties'>

export type UpdateSecretsData = Array<{
  key: Uppercase<string>
  newKey?: Uppercase<string>
  value?: string
  description?: string | null
}>

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
