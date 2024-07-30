import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

export interface DeleteEnvironmentArgs {
  project: string
  environment: string
}

type DeleteEnvironmentError = ApiError<
  'project_not_found' | 'environment_not_found' | 'environment_locked'
>

async function deleteEnvironment(
  client: HttpClient,
  args: DeleteEnvironmentArgs
): Promise<ApiResponse<null, DeleteEnvironmentError>> {
  const { project } = args

  try {
    const data = await client.del<null>({
      path: `/v1/projects/${project}/environments/${args.environment}`,
    })

    return { data: data, error: null }
  } catch (error: any) {
    console.log(error)

    const apiError = createApiErrorFromResponse<DeleteEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { deleteEnvironment }
