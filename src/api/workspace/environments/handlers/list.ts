import { ApiResponse } from '../../../../http/response'
import { ProjectContextError } from '../../../../types/errors'
import { Environment, ListEnvironmentOptions } from '../../../../types/environments'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'
import {
  InvalidEnvironmentOrderError,
  InvalidEnvironmentSearchError,
  InvalidEnvironmentSortByError,
} from '../../../../types/errors/environments'
import { invalidEnvironmentOrderError } from '../../../../errors'

// ???
// export interface GetEnvironmentOpts {
//   page?: number
//   perPage: number
// }
//
type ListEnvironmentsError =
  | ProjectContextError
  | InvalidEnvironmentSortByError
  | InvalidEnvironmentOrderError
  | InvalidEnvironmentSearchError

async function listEnvironments(
  args: EnvironmentHandlerArgs<{ options?: ListEnvironmentOptions }>
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsError>> {
  const { client, project } = args
  const opts = args.options

  const query: Record<string, string | number | boolean> = {}

  if (opts?.sortBy) {
    query.sort_by = opts.sortBy
  }

  if (opts?.order) {
    query.order = true
  }

  if (opts?.search) {
    query.search = opts.search
  }
  const path = `/v1/projects/${project}/environments`

  return await client.sendApiRequest<Array<Environment>, ListEnvironmentsError>({
    method: 'GET',
    path,
    query,
  })
}

export { listEnvironments }
