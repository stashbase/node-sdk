import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'

export type LockEnvironmentArgs = EnvironmentHandlerArgs<{
  envNameOrId: string
  lock: boolean
}>

type LockEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function lockUnlockEnvironment(
  args: LockEnvironmentArgs
): Promise<ApiResponse<null, LockEnvironmentError>> {
  const { client, project, envNameOrId, lock } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${envNameOrId}/${lock ? 'lock' : 'unlock'}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<LockEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { lockUnlockEnvironment }
