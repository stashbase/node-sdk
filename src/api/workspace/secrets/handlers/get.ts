import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type Secret = { key: Uppercase<string>; value: string; description: string | null }

type GetSecretError = ApiError<'project_not_found' | 'environment_not_found' | 'secret_not_found'>
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

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetSecretError>(error)

    return { data: null, error: apiError }
  }
}

export { getSecret }
