import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { Environment } from '../../../../types/environments'

// ???
// export interface GetEnvironmentOpts {
//   page?: number
//   perPage: number
// }
//
export interface ListEnvironmentArgs {
  /** Project name or id. */
  project: string
  /** The field to sort by. */
  sortBy?: 'name' | 'locked' | 'createdAt' | 'secretCount'
  /** Whether to sort in ascending or descending order, default: 'asc'. */
  order?: 'asc' | 'desc'
  /** A search query (min 2, max 40 characters). */
  search?: string
}

type ListEnvironmentsError = GenericApiError | ProjectNotFoundError

async function listEnvironments(
  client: HttpClient,
  args: ListEnvironmentArgs
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsError>> {
  const { project } = args

  const query: Record<string, string | number | boolean> = {}

  if (args.sortBy) {
    query['sort-by'] = args.sortBy
  }

  if (args.order) {
    query.order = true
  }

  if (args.search) {
    query.search = args.search
  }

  try {
    const data = await client.get<Array<Environment>>({
      path: `/v1/projects/${project}/environments`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListEnvironmentsError>(error)
    return responseFailure(apiError)
  }
}

export { listEnvironments }
