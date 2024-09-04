import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../types/util'
import { UpdateSecretsResData } from '../../../../types/secrets'
import { UpdateSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'

export type UpdateSecretsData = Array<
  {
    key: Uppercase<string>
  } & AtLeastOne<{
    newKey: Uppercase<string>
    value: string
    description: string | null
  }>
>

async function updateSecrets(
  envClient: HttpClient,
  data: UpdateSecretsData
): Promise<ApiResponse<UpdateSecretsResData, UpdateSecretsError>> {
  return await envClient.sendApiRequest<UpdateSecretsResData, UpdateSecretsError>({
    method: 'PATCH',
    path: '/v1/secrets',
    data,
  })
}

export { updateSecrets }
