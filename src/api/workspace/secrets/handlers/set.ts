import { ApiResponse } from '../../../../http/response'
import { SetSecretsItem, SetSecretsResponse } from '../../../../types/secrets'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { SetSecretsErrorCode as SharedSetSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type SetSecretsErrorCode = SharedSetSecretsErrorCode | EnvironmentContextErrorCode

export type SetSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<SetSecretsItem>
}>

async function setSecrets(
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResponse, SetSecretsErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<SetSecretsResponse, SetSecretsErrorCode>({
    method: 'PUT',
    path,
    data,
  })
}

export { setSecrets }
