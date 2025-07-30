import { HttpClient } from '../../../../http/client'
import { DeleteSecretsError } from '../../../../types/errors/secrets'
import { DeleteSecretsResponse, SecretName } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

async function deleteEnvironmentSecrets(
  client: HttpClient,
  names: SecretName[]
): Promise<ApiResponse<DeleteSecretsResponse, DeleteSecretsError>> {
  const path = '/v1/secrets/delete'

  return client.sendApiRequest<DeleteSecretsResponse, DeleteSecretsError>({
    method: 'POST',
    data: names,
    path,
  })
}

export { deleteEnvironmentSecrets }
