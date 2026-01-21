import { HttpClient } from '../../../../http/client'
import { CreateSecretsError } from '../../../../types/errors/secrets'
import { CreateSecretsResponse } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

export type CreateSecretsData = Array<{
  name: Uppercase<string>
  value: string
  comment?: string | null
}>

async function createSecrets(
  envClient: HttpClient,
  data: CreateSecretsData
): Promise<ApiResponse<CreateSecretsResponse, CreateSecretsError>> {
  const path = '/v1/environment/secrets'

  return envClient.sendApiRequest<CreateSecretsResponse, CreateSecretsError>({
    method: 'POST',
    path,
    data,
  })
}

export { createSecrets }
