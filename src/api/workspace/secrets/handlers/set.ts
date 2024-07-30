import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { SecretKey } from '../../../../types/secretKey'

type SetSecretsResponseData = null

type SetSecretsError =
  | ApiError<'no_values_provided'>
  | ApiError<'invalid_secret_keys', { secretKeys: Array<string> }>
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<SecretKey> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<SecretKey> }>

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
