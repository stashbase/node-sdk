import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type SetSecretsResponseData = null

type SetSecretsError =
  | ApiError<'invalid_secret_keys', { secretKeys: Array<Uppercase<string>> }>
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<Uppercase<string>> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<Uppercase<string>> }>

export interface SetSecretsArgs {
  project: string
  environment: string
  data: Array<SetSecretData>
}

export type SetSecretData = {
  key: Uppercase<string>
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
