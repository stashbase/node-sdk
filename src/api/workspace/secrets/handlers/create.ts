import {
  CreateSecretsData,
  CreateSecretsItem,
  CreateSecretsResData,
} from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextError } from '../../../../types/errors'
import { CreateSecretsError as SharedCreateSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type CreateSecretsError = SharedCreateSecretsError | EnvironmentContextError

export type CreateSecretsArgs = ProjectEnvHandlerArgs<{
  data: CreateSecretsItem[]
}>

async function createSecrets(
  args: CreateSecretsArgs
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<CreateSecretsResData, CreateSecretsError>({
    method: 'POST',
    path,
    data,
  })
}

export { createSecrets }
