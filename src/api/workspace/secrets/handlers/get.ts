import { HttpClient } from '../../../../http/client'
import {
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  responseFailure,
  responseSuccess,
} from '../../../../http/response'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetSecretError as SharedGetSecretsError } from '../../../../types/errors/secrets'

type Secret = { key: SecretKey; value: string; description: string | null }

type GetSecretError = ProjectNotFoundError | EnvironmentNotFoundError | SharedGetSecretsError
type GetSecretResponse = Promise<ApiResponse<Secret, GetSecretError>>

export interface GetSecretArgs {
  project: string
  // environment name
  environment: string
  // secret key
  key: Uppercase<string>
  expandRefs?: boolean
}

async function getSecret(envClient: HttpClient, args: GetSecretArgs): GetSecretResponse {
  const { project, environment, key } = args

  try {
    const secrets = await envClient.get<Secret>({
      path: `/projects/${project}/environments/${environment}/secrets/${key}`,
      query: args.expandRefs ? { 'expand-refs': 'true' } : undefined,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getSecret }
