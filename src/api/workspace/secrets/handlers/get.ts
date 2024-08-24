import { HttpClient } from '../../../../http/client'
import { GetSecretResData } from '../../../../types/secrets'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { GetSecretError as SharedGetSecretsError } from '../../../../types/errors/secrets'

type GetSecretError = SharedGetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError
type GetSecretResponse = Promise<ApiResponse<GetSecretResData, GetSecretError>>

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
    const secrets = await envClient.get<GetSecretResData>({
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
