import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteAllSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  GenericApiError,
  ProjectNotFoundError,
} from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type DeleteAllSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | GenericApiError

export type DeleteAllSecretsArgs = ProjectEnvHandlerArgs<undefined>

async function deleteAllSecrets(
  args: DeleteAllSecretsArgs
): Promise<ApiResponse<DeleteAllSecretsResData, DeleteAllSecretsError>> {
  const { client, project, environment } = args

  try {
    const data = await client.del<DeleteAllSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets/all`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteAllSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteAllSecrets }
