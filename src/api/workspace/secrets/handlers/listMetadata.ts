import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode, GenericApiErrorCode } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'
import { ListSecretsMetadataResponse } from '../../../../types/secrets'

type ListSecretsMetadataErrorCode = GenericApiErrorCode | EnvironmentContextErrorCode

export type ListSecretsMetadataArgs = ProjectEnvHandlerArgs<undefined>

async function listSecretsMetadata(
  args: ListSecretsMetadataArgs
): Promise<ApiResponse<ListSecretsMetadataResponse, ListSecretsMetadataErrorCode>> {
  const { client, project, environment } = args

  return await client.sendApiRequest<ListSecretsMetadataResponse, ListSecretsMetadataErrorCode>({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets/metadata`,
  })
}

export { listSecretsMetadata }
