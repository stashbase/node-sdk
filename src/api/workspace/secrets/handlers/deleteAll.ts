import { DeleteAllSecretsResponse } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextError, GenericApiError } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type DeleteAllSecretsError = GenericApiError | EnvironmentContextError

export type DeleteAllSecretsArgs = ProjectEnvHandlerArgs<undefined>

async function deleteAllSecrets(
  args: DeleteAllSecretsArgs
): Promise<ApiResponse<DeleteAllSecretsResponse, DeleteAllSecretsError>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets/all`

  return await client.sendApiRequest<DeleteAllSecretsResponse, DeleteAllSecretsError>({
    method: 'DELETE',
    path,
  })
}

export { deleteAllSecrets }
