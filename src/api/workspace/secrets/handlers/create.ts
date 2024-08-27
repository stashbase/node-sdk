import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { CreateSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { CreateSecretsError as SharedCreateSecretsError } from '../../../../types/errors/secrets'

type CreateSecretsError = SharedCreateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export interface CreateManySecretsArgs {
  project: string
  environment: string
  data: Array<CreateSecretData>
}

export interface CreateSecretArgs {
  project: string
  environment: string
  data: CreateSecretData
}

export type CreateSecretData = {
  key: Uppercase<string>
  value: string
  description?: string | null
}

async function createSecrets(
  envClient: HttpClient,
  args: CreateManySecretsArgs
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  try {
    const { project, environment, data } = args

    const resData = await envClient.post<CreateSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { createSecrets }
