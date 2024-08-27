import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { GetSecretError as SharedGetSecretsError } from '../../../../types/errors/secrets'
import { GetSecretOptions, Secret } from '../../../../types/secrets'
import { listSecrets } from './list'

type GetSecretError = SharedGetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError
type GetSecretResponse = Promise<ApiResponse<Secret | null, GetSecretError>>

export type GetSecretArgs = {
  project: string
  // environment name
  environment: string
  // secret key
  key: SecretKey
} & GetSecretOptions

async function getSecret(envClient: HttpClient, args: GetSecretArgs): GetSecretResponse {
  const { data, error } = await listSecrets(envClient, {
    ...args,
    only: [args.key],
  })

  if (error) {
    return responseFailure(error)
  }

  const secret = data?.[0] ?? null
  return responseSuccess(secret)
}

export { getSecret }
