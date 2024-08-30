import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { Environment } from '../../../../types/environments'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'

// ???
// export interface GetEnvironmentOpts {
//   page?: number
//   perPage: number
// }
//
export interface ListEnvironmentOptions {
  /** The field to sort by. */
  sortBy?: 'name' | 'locked' | 'createdAt' | 'secretCount'
  /** Whether to sort in ascending or descending order, default: 'asc'. */
  order?: 'asc' | 'desc'
  /** A search query (min 2, max 40 characters). */
  search?: string
}

type ListEnvironmentsError = GenericApiError | ProjectNotFoundError

async function listEnvironments(
  args: EnvironmentHandlerArgs<{ opts?: ListEnvironmentOptions }>
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsError>> {
  const { client, project } = args
  const opts = args.opts

  const query: Record<string, string | number | boolean> = {}

  if (opts?.sortBy) {
    query['sort-by'] = opts.sortBy
  }

  if (opts?.order) {
    query.order = true
  }

  if (opts?.search) {
    query.search = opts.search
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
