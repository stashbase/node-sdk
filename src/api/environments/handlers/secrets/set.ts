import { HttpClient } from '../../../../http/client'
import { SetSecretsResData } from '../../../../types/secrets'
import { SetSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'
import { SecretName } from '../../../../types/secrets'

export type SetSecretsData = Array<{
  name: SecretName
  value: string
  description?: string | null
}>

async function setSecrets(
  envClient: HttpClient,
  data: SetSecretsData
): Promise<ApiResponse<SetSecretsResData, SetSecretsError>> {
  return await envClient.sendApiRequest<SetSecretsResData, SetSecretsError>({
    method: 'PUT',
    path: '/v1/secrets',
    data,
  })
}

export { setSecrets }
