import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse } from '../../../../http/response'

export interface LockEnvironmentArgs {
  project: string
  // NOTE: naming ???
  // environment: string
  name: string
}

type LockEnvironmentError = ApiError<'project_not_found' | 'environment_not_found'>

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

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<LockEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { lockUnlockEnvironment }
