import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

export interface CreateEnvironmentArgs {
  project: string
  //
  name: string
  description?: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}

type CreateEnvironmentError = ApiError<
  'project_not_found' | 'environment_already_exists' | 'environment_limit_reached'
>

async function createEnvironment(
  client: HttpClient,
  args: CreateEnvironmentArgs
): Promise<ApiResponse<null, CreateEnvironmentError>> {
  const { project } = args

  try {
    const data = await client.post<null>({
      path: `/projects/${project}/environments`,
      data: { ...args, project: undefined },
    })

    return { data: data, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<CreateEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { createEnvironment }
