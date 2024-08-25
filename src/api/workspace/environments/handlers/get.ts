import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { Environment } from '../../../../types/environments'

export interface GetEnvironmentArgs {
  project: string
  environment: string
}

type GetEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function getEnvironment(
  client: HttpClient,
  args: GetEnvironmentArgs
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  const { project, environment } = args

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
