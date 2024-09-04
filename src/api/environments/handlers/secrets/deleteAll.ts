import { HttpClient } from '../../../../http/client'
import { GenericApiError } from '../../../../types/errors'
import { DeleteAllSecretsResData } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

type DeleteAllSecretsError = GenericApiError

async function deleteAllEnvironmentSecrets(
  client: HttpClient
): Promise<ApiResponse<DeleteAllSecretsResData, DeleteAllSecretsError>> {
  const path = '/v1/secrets/delete/all'

  return client.sendApiRequest<DeleteAllSecretsResData, DeleteAllSecretsError>({
    method: 'POST',
    path,
  })
}

export { deleteAllEnvironmentSecrets }
