import { ApiResponse } from '../../../../http/response'
import { SetSecretsItem, SetSecretsResData } from '../../../../types/secrets'
import { ProjectContextError } from '../../../../types/errors'
import { SetSecretsError as SharedSetSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type SetSecretsError = SharedSetSecretsError | ProjectContextError

export type SetSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<SetSecretsItem>
}>

async function setSecrets(
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResData, SetSecretsError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<SetSecretsResData, SetSecretsError>({
    method: 'PUT',
    path,
    data,
  })
}

export { setSecrets }
