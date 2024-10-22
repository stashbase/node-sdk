import { ApiResponse } from '../../../../http/response'
import { DeleteSecretsResData, SecretName } from '../../../../types/secrets'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { DeleteSecretsError as SharedDeleteSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type DeleteSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | SharedDeleteSecretsError

export type DeleteSecretsArgs = ProjectEnvHandlerArgs<{
  names: Array<SecretName>
}>

async function deleteSecrets(
  args: DeleteSecretsArgs
): Promise<ApiResponse<DeleteSecretsResData, DeleteSecretsError>> {
  const { client, project, environment, names } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets/delete`

  return await client.sendApiRequest<DeleteSecretsResData, DeleteSecretsError>({
    method: 'POST',
    path,
    data: names,
  })
}

export { deleteSecrets }
