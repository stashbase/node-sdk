import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type DuplicateEnvironmentArgs = {
  project: string
  //
  name: string
  duplicateName: string
}

type DulicateEnvironmentError = ApiError<
  | 'project_not_found'
  | 'environment_not_found'
  | 'environment_already_exists'
  | 'environment_locked'
>

async function duplicateEnvironment(
  client: HttpClient,
  args: DuplicateEnvironmentArgs
): Promise<ApiResponse<null, DulicateEnvironmentError>> {
  const { project, name, duplicateName } = args

  try {
    const data = await client.post<null>({
      path: `/v1/projects/${project}/environments/${name}/duplicate`,
      data: { name: duplicateName },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DulicateEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { duplicateEnvironment }
