import { HttpClient } from '../../../../http/client'
import { CreateSecretsError } from '../../../../types/errors/secrets'
import { CreateSecretsResData } from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'

export type CreateSecretsData = Array<{
  name: Uppercase<string>
  value: string
  description?: string | null
}>

async function createSecrets(
  envClient: HttpClient,
  data: CreateSecretsData
): Promise<ApiResponse<CreateSecretsResData, CreateSecretsError>> {
  const path = '/v1/secrets'

  return envClient.sendApiRequest<CreateSecretsResData, CreateSecretsError>({
    method: 'POST',
    path,
    data,
  })
}

export { createSecrets }
