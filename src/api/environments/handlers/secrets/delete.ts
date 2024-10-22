import { HttpClient } from '../../../../http/client'
import { DeleteSecretsError } from '../../../../types/errors/secrets'
import { DeleteSecretsResData, SecretName } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

async function deleteEnvironmentSecrets(
  client: HttpClient,
  names: SecretName[]
): Promise<ApiResponse<DeleteSecretsResData, DeleteSecretsError>> {
  const path = '/v1/secrets/delete'

  return client.sendApiRequest<DeleteSecretsResData, DeleteSecretsError>({
    method: 'POST',
    data: names,
    path,
  })
}

export { deleteEnvironmentSecrets }
