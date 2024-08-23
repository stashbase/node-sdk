import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'

export interface UpdateEnvironmentTypeArgs {
  project: string
  //
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}

type UpdateEnvironmentTypeError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function updateEnvironmentType(
  client: HttpClient,
  args: UpdateEnvironmentTypeArgs
): Promise<ApiResponse<null, UpdateEnvironmentTypeError>> {
  const { project, name, type } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${name}`,
      data: { type },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateEnvironmentTypeError>(error)
    return responseFailure(apiError)
  }
}

export { updateEnvironmentType }
