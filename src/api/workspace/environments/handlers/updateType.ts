import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'

type NewType = EnvironmentHandlerArgs<{
  envNameOrId: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
}>

export type UpdateEnvironmentTypeArgs = NewType

type UpdateEnvironmentTypeError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function updateEnvironmentType(
  args: UpdateEnvironmentTypeArgs
): Promise<ApiResponse<null, UpdateEnvironmentTypeError>> {
  const { client, project, envNameOrId, type } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${envNameOrId}`,
      data: { type },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateEnvironmentTypeError>(error)
    return responseFailure(apiError)
  }
}

export { updateEnvironmentType }
