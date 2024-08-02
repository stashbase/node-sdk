import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { CreateSecretsError as SharedCreateSecretsError } from '../../../../types/errors/secrets'

type CreateSecretsResponseData = {
  createdCount: number
  duplicateKeys?: Array<SecretKey>
}

// type CreateSecretsError = ApiError<
//   'no_values_provided' | 'project_not_found' | 'environment_not_found' | 'duplicate_keys'
// >

type CreateSecretsError = SharedCreateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

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
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { createSecrets }
