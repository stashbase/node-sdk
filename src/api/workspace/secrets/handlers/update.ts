import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
}

type UpdateSecretsError = ApiError<
  'no_values_provided' | 'missing_properties' | 'project_not_found' | 'environment_not_found'
>

export interface UpdateSecretsArgs {
  project: string
  environment: string
  data: Array<UpdateSecretData>
}

export type UpdateSecretData = {
  key: Uppercase<string>
  newKey?: Uppercase<string>
  value?: string
  description?: string | null
}

async function updateSecrets(
  envClient: HttpClient,
  args: UpdateSecretsArgs
): Promise<ApiResponse<UpdateSecretsResponseData, UpdateSecretsError>> {
  const { project, environment, data } = args

  try {
    const secrets = await envClient.patch<UpdateSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets`,
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
