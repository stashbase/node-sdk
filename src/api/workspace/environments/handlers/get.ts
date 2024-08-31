import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { Environment } from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type GetEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type GetEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function getEnvironment(
  args: GetEnvironmentArgs
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  const { client, project, environment } = args

  try {
    const data = await client.get<Environment>({
      path: `/v1/projects/${project}/environments/${environment}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { getEnvironment }
