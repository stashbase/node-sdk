import { ApiResponse } from '../../../../http/response'
import { ProjectContextErrorCode } from '../../../../types/errors'
import { Environment, ListEnvironmentOptions } from '../../../../types/environments'
import { EnvironmentHandlerArgs } from '../../../../types/arguments'
import {
  InvalidEnvironmentOrderErrorCode,
  InvalidEnvironmentSearchErrorCode,
  InvalidEnvironmentSortByErrorCode,
} from '../../../../types/errors/environments'
import { invalidEnvironmentOrderError } from '../../../../errors'
import { stringToSnakeCase } from '../../../../utils/serializer'

// ???
// export interface GetEnvironmentOpts {
//   page?: number
//   perPage: number
// }
//
type ListEnvironmentsErrorCode =
  | ProjectContextErrorCode
  | InvalidEnvironmentSortByErrorCode
  | InvalidEnvironmentOrderErrorCode
  | InvalidEnvironmentSearchErrorCode

async function listEnvironments(
  args: EnvironmentHandlerArgs<{ options?: ListEnvironmentOptions }>
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsErrorCode>> {
  const { client, project } = args
  const opts = args.options

  const query: Record<string, string | number | boolean> = {}

  if (opts?.sortBy) {
    query.sort_by = stringToSnakeCase(opts.sortBy)
  }

  if (opts?.order) {
    query.order = opts.order
  }

  if (opts?.search) {
    query.search = opts.search
  }
  const path = `/v1/projects/${project}/environments`

  return await client.sendApiRequest<Array<Environment>, ListEnvironmentsErrorCode>({
    method: 'GET',
    path,
    query,
  })
}

export { listEnvironments }
