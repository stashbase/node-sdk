import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type SetSecretsResponseData = null

type CreateSecretsError = ApiError<
  'no_values_provided' | 'project_not_found' | 'environment_not_found'
>

export interface SetSecretsArgs {
  project: string
  environment: string
  data: Array<SetSecretData>
}

export type SetSecretData = {
  key: Uppercase<string>
  value: string
  description?: string
}

async function setSecrets(
  envClient: HttpClient,
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResponseData, CreateSecretsError>> {
  try {
    const { project, environment, data } = args

    await envClient.post<SetSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets/set`,
      data,
    })

    return { data: null, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { setSecrets }
