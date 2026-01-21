import { HttpClient } from '../../../../http/client'
import { GenericApiError } from '../../../../types/errors'
import { DeleteAllSecretsResponse } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

type DeleteAllSecretsError = GenericApiError

async function deleteAllEnvironmentSecrets(
  client: HttpClient
): Promise<ApiResponse<DeleteAllSecretsResponse, DeleteAllSecretsError>> {
  const path = '/v1/environment/secrets/delete/all'

  return client.sendApiRequest<DeleteAllSecretsResponse, DeleteAllSecretsError>({
    method: 'POST',
    path,
  })
}

export { deleteAllEnvironmentSecrets }
