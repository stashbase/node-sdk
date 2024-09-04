import { ApiResponse } from '../../../../http/response'
import { DeleteSecretsResData } from '../../../../types/secrets'
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
  const path = `/v1/projects/${project}/environments/${environment}/secrets/delete`

  return await client.sendApiRequest<DeleteSecretsResData, DeleteSecretsError>({
    method: 'POST',
    path,
    data: keys,
  })
}

export { deleteSecrets }
