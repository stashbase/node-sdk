import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

export interface RenameEnvironmentArgs {
  project: string
  //
  name: string
  newName: string
}

type RenameEnvironmentError = ApiError<
  | 'project_not_found'
  | 'environment_not_found'
  | 'environment_already_exists'
  | 'environment_locked'
>

async function renameEnvironment(
  client: HttpClient,
  args: RenameEnvironmentArgs
): Promise<ApiResponse<null, RenameEnvironmentError>> {
  const { project, name, newName } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${name}/rename`,
      data: { name: newName },
    })

    return { data: data, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<RenameEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { renameEnvironment }
