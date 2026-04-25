import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../types/util'
import { SecretName, UpdateSecretsResponse } from '../../../../types/secrets'
import { UpdateSecretsErrorCode } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'

export type UpdateSecretsData = Array<
  {
    name: SecretName
  } & AtLeastOne<{
    newName: SecretName
    value: string
    comment: string | null
  }>
>

async function updateSecrets(
  envClient: HttpClient,
  data: UpdateSecretsData
): Promise<ApiResponse<UpdateSecretsResponse, UpdateSecretsErrorCode>> {
  return await envClient.sendApiRequest<UpdateSecretsResponse, UpdateSecretsErrorCode>({
    method: 'PATCH',
    path: '/v1/environment/secrets',
    data,
  })
}

export { updateSecrets }
