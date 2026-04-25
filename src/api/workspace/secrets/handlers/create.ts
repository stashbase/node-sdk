import {
  CreateSecretsData,
  CreateSecretsItem,
  CreateSecretsResponse,
} from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { CreateSecretsErrorCode as SharedCreateSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type CreateSecretsErrorCode = SharedCreateSecretsErrorCode | EnvironmentContextErrorCode

export type CreateSecretsArgs = ProjectEnvHandlerArgs<{
  data: CreateSecretsItem[]
}>

async function createSecrets(
  args: CreateSecretsArgs
): Promise<ApiResponse<CreateSecretsResponse, CreateSecretsErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<CreateSecretsResponse, CreateSecretsErrorCode>({
    method: 'POST',
    path,
    data,
  })
}

export { createSecrets }
