import { HttpClient } from '../../../../http/client'
import { DeleteSecretsErrorCode } from '../../../../types/errors/secrets'
import { DeleteSecretsResponse, SecretName } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

async function deleteEnvironmentSecrets(
  client: HttpClient,
  names: SecretName[]
): Promise<ApiResponse<DeleteSecretsResponse, DeleteSecretsErrorCode>> {
  const path = '/v1/environment/secrets/delete'

  return client.sendApiRequest<DeleteSecretsResponse, DeleteSecretsErrorCode>({
    method: 'POST',
    data: names,
    path,
  })
}

export { deleteEnvironmentSecrets }
