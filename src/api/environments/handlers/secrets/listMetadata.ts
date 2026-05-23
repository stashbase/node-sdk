import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListSecretsErrorCode } from '../../../../types/errors/secrets'
import { ListSecretsMetadataResponse } from '../../../../types/secrets'

async function listSecretsMetadata(
  envClient: HttpClient
): Promise<ApiResponse<ListSecretsMetadataResponse, ListSecretsErrorCode>> {
  return envClient.sendApiRequest<ListSecretsMetadataResponse, ListSecretsErrorCode>({
    method: 'GET',
    path: '/v1/environment/secrets/metadata',
  })
}

export { listSecretsMetadata }
