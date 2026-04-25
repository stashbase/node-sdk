import { ApiResponse } from '../../../../http/response'
import { UpdateSecretsItem, UpdateSecretsResponse } from '../../../../types/secrets'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { UpdateSecretsErrorCode as SharedUpdateSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type UpdateSecretsErrorCode = SharedUpdateSecretsErrorCode | EnvironmentContextErrorCode

export type UpdateSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<UpdateSecretsItem>
}>

async function updateSecrets(
  args: UpdateSecretsArgs
): Promise<ApiResponse<UpdateSecretsResponse, UpdateSecretsErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<UpdateSecretsResponse, UpdateSecretsErrorCode>({
    method: 'PATCH',
    path,
    data,
  })
}

export { updateSecrets }
