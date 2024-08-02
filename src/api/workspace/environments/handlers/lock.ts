import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  SharedApiError,
} from '../../../../types/errors'

export interface LockEnvironmentArgs {
  project: string
  // NOTE: naming ???
  // environment: string
  name: string
}

type LockEnvironmentError = SharedApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function lockUnlockEnvironment(
  client: HttpClient,
  args: LockEnvironmentArgs,
  lock: boolean
): Promise<ApiResponse<null, LockEnvironmentError>> {
  const { project, name } = args

  try {
    const data = await client.patch<null>({
      path: `/v1/projects/${project}/environments/${name}/${lock ? 'lock' : 'unlock'}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<LockEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { lockUnlockEnvironment }
