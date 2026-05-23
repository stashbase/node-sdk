import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { GetSecretErrorCode } from '../../../../types/errors/secrets'
import { GetSecretMetadataResponse } from '../../../../types/secrets'

async function getSecretMetadata(
  envClient: HttpClient,
  name: string
): Promise<ApiResponse<GetSecretMetadataResponse, GetSecretErrorCode>> {
  return envClient.sendApiRequest<GetSecretMetadataResponse, GetSecretErrorCode>({
    method: 'GET',
    path: `/v1/environment/secrets/${name}/metadata`,
  })
}

export { getSecretMetadata }
