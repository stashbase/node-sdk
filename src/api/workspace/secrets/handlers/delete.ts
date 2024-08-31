import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { DeleteSecretsError as SharedDeleteSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { SecretKey } from '../../../../types/secretKey'

type DeleteSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | SharedDeleteSecretsError

export type DeleteSecretsArgs = ProjectEnvHandlerArgs<{
  keys: Array<SecretKey>
}>

async function deleteSecrets(
  args: DeleteSecretsArgs
): Promise<ApiResponse<DeleteSecretsResData, DeleteSecretsError>> {
  const { client, project, environment, keys } = args

  try {
    const data = await client.post<DeleteSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets/delete`,
      data: keys,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteSecrets }
