import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

// ???
// export interface GetEnvironmentOpts {
//   page?: number
//   perPage: number
// }
//
export interface ListEnvironmentArgs {
  project: string
}

interface Environment {
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  locked: boolean
  name: string
  createdAt: string
  description: string | null
}

type ListEnvironmentsError = ApiError<'project_not_found'>

async function listEnvironments(
  client: HttpClient,
  args: ListEnvironmentArgs
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsError>> {
  const { project } = args

  try {
    const data = await client.get<Array<Environment>>({
      path: `/projects/${project}/environments`,
    })

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error)
    const apiError = createApiErrorFromResponse<ListEnvironmentsError>(error)

    return { data: null, error: apiError }
  }
}

export { listEnvironments }
