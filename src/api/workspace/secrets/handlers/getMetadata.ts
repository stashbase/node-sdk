import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { GetSecretErrorCode as SharedGetSecretErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'
import { GetSecretMetadataResponse, SecretName } from '../../../../types/secrets'

type GetSecretMetadataErrorCode = SharedGetSecretErrorCode | EnvironmentContextErrorCode

export type GetSecretMetadataArgs = ProjectEnvHandlerArgs<{
  name: SecretName
}>

async function getSecretMetadata(
  args: GetSecretMetadataArgs
): Promise<ApiResponse<GetSecretMetadataResponse, GetSecretMetadataErrorCode>> {
  const { client, project, environment, name } = args

  return await client.sendApiRequest<GetSecretMetadataResponse, GetSecretMetadataErrorCode>({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets/${name}/metadata`,
  })
}

export { getSecretMetadata }
