import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLimitReachedError,
} from '../../../../types/errors/environments'
import { ProjectNotFoundError, SharedApiError } from '../../../../types/errors'

export interface CreateEnvironmentArgs {
  project: string
  //
  name: string
  description?: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}

type CreateEnvironmentError =
  | SharedApiError
  | ProjectNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLimitReachedError

async function createEnvironment(
  client: HttpClient,
  args: CreateEnvironmentArgs
): Promise<ApiResponse<null, CreateEnvironmentError>> {
  const { project } = args

  try {
    const data = await client.post<null>({
      path: `/v1/projects/${project}/environments`,
      data: { ...args, project: undefined },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { createEnvironment }
