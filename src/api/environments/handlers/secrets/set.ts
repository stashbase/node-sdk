import { HttpClient } from '../../../../http/client'
import { SetSecretsResponse } from '../../../../types/secrets'
import { SetSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'
import { SecretName } from '../../../../types/secrets'

export type SetSecretsData = Array<{
  name: SecretName
  value: string
  comment?: string | null
}>

async function setSecrets(
  envClient: HttpClient,
  data: SetSecretsData
): Promise<ApiResponse<SetSecretsResponse, SetSecretsError>> {
  return await envClient.sendApiRequest<SetSecretsResponse, SetSecretsError>({
    method: 'PUT',
    path: '/v1/environment/secrets',
    data,
  })
}

export { setSecrets }
