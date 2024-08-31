import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type LockEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  lock: boolean
}>

type LockEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function lockUnlockEnvironment(
  args: LockEnvironmentArgs
): Promise<ApiResponse<null, LockEnvironmentError>> {
  const { client, project, environment, lock } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${environment}/${lock ? 'lock' : 'unlock'}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<LockEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { lockUnlockEnvironment }
