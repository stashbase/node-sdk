import { ApiResponse } from '../../../../http/response'
import { UpsertSecretsItem, UpsertSecretsResponse } from '../../../../types/secrets'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { UpsertSecretsErrorCode as SharedUpsertSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type UpsertSecretsErrorCode = SharedUpsertSecretsErrorCode | EnvironmentContextErrorCode

export type UpsertSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<UpsertSecretsItem>
}>

async function setSecrets(
  args: UpsertSecretsArgs
): Promise<ApiResponse<UpsertSecretsResponse, UpsertSecretsErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<UpsertSecretsResponse, UpsertSecretsErrorCode>({
    method: 'PUT',
    path,
    data,
  })
}

export { setSecrets }
