import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLockedError,
} from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  SharedApiError,
} from '../../../../types/errors'

export interface RenameEnvironmentArgs {
  project: string
  //
  name: string
  newName: string
}

type RenameEnvironmentError =
  | SharedApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLockedError

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

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RenameEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { renameEnvironment }
