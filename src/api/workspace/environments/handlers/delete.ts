import { createApiErrorFromResponse } from '../../../../errors'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type DeleteEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type DeleteEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function deleteEnvironment(
  args: DeleteEnvironmentArgs
): Promise<ApiResponse<null, DeleteEnvironmentError>> {
  const { client, project, environment } = args

  try {
    const data = await client.del<null>({
      path: `/v1/projects/${project}/environments/${environment}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { deleteEnvironment }
