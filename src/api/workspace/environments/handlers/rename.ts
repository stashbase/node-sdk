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
  GenericApiError,
} from '../../../../types/errors'

export interface RenameEnvironmentArgs {
  project: string
  //
  environment: string
  newName: string
}

type RenameEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLockedError

async function renameEnvironment(
  client: HttpClient,
  args: RenameEnvironmentArgs
): Promise<ApiResponse<null, RenameEnvironmentError>> {
  const { project, environment, newName } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${environment}`,
      data: { name: newName },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RenameEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { renameEnvironment }
