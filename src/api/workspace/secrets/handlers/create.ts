import { HttpClient } from '../../../../http/client'
import {
  ApiError,
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
} from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type CreateSecretsResponseData = {
  createdCount: number
  duplicateKeys?: Array<Uppercase<string>>
}

// type CreateSecretsError = ApiError<
//   'no_values_provided' | 'project_not_found' | 'environment_not_found' | 'duplicate_keys'
// >

type CreateSecretsError =
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<Uppercase<string>> }>
  | ApiError<'invalid_secret_keys', { secretKeys: Array<Uppercase<string>> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<Uppercase<string>> }>

export interface CreateSecretsArgs {
  project: string
  environment: string
  data: Array<CreateSecretData>
}

export type CreateSecretData = {
  key: Uppercase<string>
  value: string
  description?: string
}

async function createSecrets(
  envClient: HttpClient,
  args: CreateSecretsArgs
): Promise<ApiResponse<CreateSecretsResponseData, CreateSecretsError>> {
  try {
    const { project, environment, data } = args

    const secrets = await envClient.post<CreateSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { createSecrets }
