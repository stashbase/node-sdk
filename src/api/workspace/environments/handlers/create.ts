import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLimitReachedError,
} from '../../../../types/errors/environments'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'

export interface CreateEnvironmentArgs {
  project: string
  //
  name: string
  description?: string | null
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}

interface CreateEnvironmentResponseData {
  id: string
  name: string
}

type CreateEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLimitReachedError

async function createEnvironment(
  client: HttpClient,
  args: CreateEnvironmentArgs
): Promise<ApiResponse<CreateEnvironmentResponseData, CreateEnvironmentError>> {
  const { project } = args

  try {
    const data = await client.post<CreateEnvironmentResponseData>({
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
