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
}

type ListEnvironmentsError = GenericApiError | ProjectNotFoundError

async function listEnvironments(
  client: HttpClient,
  args: ListEnvironmentArgs
): Promise<ApiResponse<Array<Environment>, ListEnvironmentsError>> {
  const { project } = args

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
