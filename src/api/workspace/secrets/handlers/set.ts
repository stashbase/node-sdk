import { ApiResponse } from '../../../../http/response'
import { SetSecretsItem, SetSecretsResponse } from '../../../../types/secrets'
import { EnvironmentContextError } from '../../../../types/errors'
import { SetSecretsError as SharedSetSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type SetSecretsError = SharedSetSecretsError | EnvironmentContextError

export type SetSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<SetSecretsItem>
}>

async function setSecrets(
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResponse, SetSecretsError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<SetSecretsResponse, SetSecretsError>({
    method: 'PUT',
    path,
    data,
  })
}

export { setSecrets }
