import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse } from '../../../../http/response'

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
}

type GetEnvironmentError = ApiError<'project_not_found' | 'environment_not_found'>

async function getEnvironment(
  client: HttpClient,
  args: GetEnvironmentArgs
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  const { project, environment } = args

  try {
    const data = await client.get<Environment>({
      path: `/v1/projects/${project}/environments/${environment}`,
    })

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
