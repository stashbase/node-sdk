import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLimitReachedError,
} from '../../../../types/errors/environments'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'
import { CreateEnvironmentData } from '../../../../types/environments'

export type CreateEnvironmentArgs = EnvironmentHandlerArgs<{
  data: CreateEnvironmentData
}>

interface CreateEnvironmentResponseData {
  id: string
  name: string
}

type CreateEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLimitReachedError

async function createEnvironment(
  args: CreateEnvironmentArgs
): Promise<ApiResponse<CreateEnvironmentResponseData, CreateEnvironmentError>> {
  const { client, project } = args

  try {
    const data = await client.post<CreateEnvironmentResponseData>({
      path: `/v1/projects/${project}/environments`,
      data: args.data,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { createEnvironment }
