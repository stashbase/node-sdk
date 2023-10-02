import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type Secret = { key: string; value: string; description?: string }

export interface GetEnvironmentOpts {
  secrets?: boolean
}

export interface GetEnvironmentArgs {
  project: string
  environment: string
}

interface Environment {
  projectName: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  name: string
  createdAt: string
  description: string | null
  secrets?: Secret[]
}

type GetEnvironmentError = ApiError<'project_not_found' | 'environment_not_found'>

async function getEnvironment(
  client: HttpClient,
  args: GetEnvironmentArgs,
  options?: GetEnvironmentOpts
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  const { project, environment } = args
  const returnSecrets = options?.secrets

  try {
    const data = await client.get<Environment>({
      path: `/projects/${project}/environments/${environment}`,
      query: returnSecrets ? { secrets: 'true' } : undefined,
    })

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
