import { HttpClient } from '../../../../http/client'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetSecretOptions, Secret } from '../../../../types/secrets'
import { listSecrets } from './list'
import { SecretKey } from '../../../../types/secretKey'
import { GenericApiError } from '../../../../types/errors'

async function getSecret(
  envClient: HttpClient,
  key: SecretKey,
  options?: GetSecretOptions
): Promise<ApiResponse<Secret | null, GenericApiError>> {
  const { data, error } = await listSecrets({ envClient, options, only: [key] })

  if (error) {
    return responseFailure(error)
  }

  const secret = data?.[0] ?? null
  return responseSuccess(secret)
}

export { getSecret }
