import { HttpClient } from '../../../../http/client'
import { UpsertSecretsResponse } from '../../../../types/secrets'
import { UpsertSecretsErrorCode } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'
import { SecretName } from '../../../../types/secrets'

export type UpsertSecretsData = Array<{
  name: SecretName
  value: string
  comment?: string | null
}>

async function setSecrets(
  envClient: HttpClient,
  data: UpsertSecretsData
): Promise<ApiResponse<UpsertSecretsResponse, UpsertSecretsErrorCode>> {
  return await envClient.sendApiRequest<UpsertSecretsResponse, UpsertSecretsErrorCode>({
    method: 'PUT',
    path: '/v1/environment/secrets',
    data,
  })
}

export { setSecrets }
