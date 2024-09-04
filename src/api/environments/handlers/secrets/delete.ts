import { HttpClient } from '../../../../http/client'
import { DeleteSecretsError } from '../../../../types/errors/secrets'
import { DeleteSecretsResData } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

async function deleteEnvironmentSecrets(
  client: HttpClient,
  keys: Uppercase<string>[]
): Promise<ApiResponse<DeleteSecretsResData, DeleteSecretsError>> {
  const path = '/v1/secrets/delete'

  return client.sendApiRequest<DeleteSecretsResData, DeleteSecretsError>({
    method: 'POST',
    data: keys,
    path,
  })
}

export { deleteEnvironmentSecrets }
