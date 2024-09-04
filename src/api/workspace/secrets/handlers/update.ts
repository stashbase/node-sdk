import { ApiResponse } from '../../../../http/response'
import { UpdateSecretsItem, UpdateSecretsResData } from '../../../../types/secrets'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateSecretsError as SharedUpdateSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type UpdateSecretsError = SharedUpdateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export type UpdateSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<UpdateSecretsItem>
}>

async function updateSecrets(
  args: UpdateSecretsArgs
): Promise<ApiResponse<UpdateSecretsResData, UpdateSecretsError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<UpdateSecretsResData, UpdateSecretsError>({
    method: 'PATCH',
    path,
    data,
  })
}

export { updateSecrets }
