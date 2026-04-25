import { HttpClient } from '../../../../http/client'
import { CreateSecretsErrorCode } from '../../../../types/errors/secrets'
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
): Promise<ApiResponse<CreateSecretsResponse, CreateSecretsErrorCode>> {
  const path = '/v1/environment/secrets'

  return envClient.sendApiRequest<CreateSecretsResponse, CreateSecretsErrorCode>({
    method: 'POST',
    path,
    data,
  })
}

export { createSecrets }
