import { createApiErrorFromResponse } from '../../../../errors'
import { CreateSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { CreateSecretsError as SharedCreateSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type CreateSecretsError = SharedCreateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export type CreateSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<CreateSecretData>
}>

export type CreateSecretData = {
  key: Uppercase<string>
  value: string
  description?: string | null
}

async function createSecrets(
  args: CreateSecretsArgs
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  try {
    const { client, project, environment, data } = args

    const resData = await client.post<CreateSecretsResData>({
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
