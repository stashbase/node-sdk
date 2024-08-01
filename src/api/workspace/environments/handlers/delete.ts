import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import {
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  SharedApiError,
  responseFailure,
  responseSuccess,
} from '../../../../http/response'
import { EnvironmentLockedError } from '../../../../types/errors/environments'

export interface DeleteEnvironmentArgs {
  project: string
  environment: string
}

type DeleteEnvironmentError =
  | SharedApiError
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
