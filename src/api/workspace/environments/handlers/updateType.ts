import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

export interface UpdateEnvironmentTypeArgs {
  project: string
  //
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}

type UpdateEnvironmentTypeError = ApiError<
  'project_not_found' | 'environment_not_found' | 'environment_locked'
>

async function updateEnvironmentType(
  client: HttpClient,
  args: UpdateEnvironmentTypeArgs
): Promise<ApiResponse<null, UpdateEnvironmentTypeError>> {
  const { project, name, type } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${name}/type`,
      data: { type },
    })

    return { data: data, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<UpdateEnvironmentTypeError>(error)

    return { data: null, error: apiError }
  }
}

export { updateEnvironmentType }
