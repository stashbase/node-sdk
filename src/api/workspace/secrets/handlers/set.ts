import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import {
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
} from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { SetSecretsError as SharedSetSecretsError } from '../../../../types/errors/secrets'

type SetSecretsResponseData = null
type SetSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | SharedSetSecretsError

export interface SetSecretsArgs {
  project: string
  environment: string
  data: Array<SetSecretData>
}

export type SetSecretData = {
  key: SecretKey
  value: string
  description?: string | null
}

async function setSecrets(
  envClient: HttpClient,
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResponseData, SetSecretsError>> {
  try {
    const { project, environment, data } = args

    await envClient.post<SetSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets/set`,
      data,
    })

    return { data: null, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { setSecrets }
