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
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'

export type RenameEnvironmentArgs = EnvironmentHandlerArgs<{
  envNameOrId: string
  newName: string
}>

type RenameEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLockedError

async function renameEnvironment(
  args: RenameEnvironmentArgs
): Promise<ApiResponse<null, RenameEnvironmentError>> {
  const { client, project, envNameOrId, newName } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${envNameOrId}`,
      data: { name: newName },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RenameEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { renameEnvironment }
