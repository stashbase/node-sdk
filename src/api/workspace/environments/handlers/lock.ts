import { ApiResponse } from '../../../../http/response'
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

  const path = `/v1/projects/${project}/environments/${environment}/${lock ? 'lock' : 'unlock'}`

  return await client.sendApiRequest<null, LockEnvironmentError>({
    method: 'PATCH',
    path,
  })
}

export { lockUnlockEnvironment }
