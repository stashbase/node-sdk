import { DeleteAllSecretsResponse } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode, GenericApiErrorCode } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type DeleteAllSecretsErrorCode = GenericApiErrorCode | EnvironmentContextErrorCode

export type DeleteAllSecretsArgs = ProjectEnvHandlerArgs<undefined>

async function deleteAllSecrets(
  args: DeleteAllSecretsArgs
): Promise<ApiResponse<DeleteAllSecretsResponse, DeleteAllSecretsErrorCode>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets/all`

  return await client.sendApiRequest<DeleteAllSecretsResponse, DeleteAllSecretsErrorCode>({
    method: 'DELETE',
    path,
  })
}

export { deleteAllSecrets }
