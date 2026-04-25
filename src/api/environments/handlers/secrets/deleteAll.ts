import { HttpClient } from '../../../../http/client'
import { GenericApiErrorCode } from '../../../../types/errors'
import { DeleteAllSecretsResponse } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

type DeleteAllSecretsErrorCode = GenericApiErrorCode

async function deleteAllEnvironmentSecrets(
  client: HttpClient
): Promise<ApiResponse<DeleteAllSecretsResponse, DeleteAllSecretsErrorCode>> {
  const path = '/v1/environment/secrets/delete/all'

  return client.sendApiRequest<DeleteAllSecretsResponse, DeleteAllSecretsErrorCode>({
    method: 'POST',
    path,
  })
}

export { deleteAllEnvironmentSecrets }
