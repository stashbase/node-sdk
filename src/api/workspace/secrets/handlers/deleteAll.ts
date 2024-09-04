import { DeleteAllSecretsResData } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
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
  const path = `/v1/projects/${project}/environments/${environment}/secrets/all`

  return await client.sendApiRequest<DeleteAllSecretsResData, DeleteAllSecretsError>({
    method: 'DELETE',
    path,
  })
}

export { deleteAllSecrets }
