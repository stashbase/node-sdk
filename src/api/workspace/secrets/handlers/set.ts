import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { SetSecretsError as SharedSetSecretsError } from '../../../../types/errors/secrets'

type SetSecretsResponseData = null
type SetSecretsError = SharedSetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

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

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { setSecrets }
