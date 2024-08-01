import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

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

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateEnvironmentTypeError>(error)
    return responseFailure(apiError)
  }
}

export { updateEnvironmentType }
