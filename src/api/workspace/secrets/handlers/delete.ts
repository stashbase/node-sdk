import { ApiResponse } from '../../../../http/response'
import { DeleteSecretsResponse, SecretName } from '../../../../types/secrets'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { DeleteSecretsErrorCode as SharedDeleteSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type DeleteSecretsErrorCode = SharedDeleteSecretsErrorCode | EnvironmentContextErrorCode

export type DeleteSecretsArgs = ProjectEnvHandlerArgs<{
  names: Array<SecretName>
}>

async function deleteSecrets(
  args: DeleteSecretsArgs
): Promise<ApiResponse<DeleteSecretsResponse, DeleteSecretsErrorCode>> {
  const { client, project, environment, names } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets/delete`

  return await client.sendApiRequest<DeleteSecretsResponse, DeleteSecretsErrorCode>({
    method: 'POST',
    path,
    data: names,
  })
}

export { deleteSecrets }
