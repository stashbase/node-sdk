import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'

export interface DeleteEnvironmentArgs {
  project: string
  environment: string
}

type DeleteEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function deleteEnvironment(
  client: HttpClient,
  args: DeleteEnvironmentArgs
): Promise<ApiResponse<null, DeleteEnvironmentError>> {
  const { project } = args

  try {
    const data = await client.del<null>({
      path: `/v1/projects/${project}/environments/${args.environment}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { deleteEnvironment }
