import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLockedError,
} from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  SharedApiError,
} from '../../../../types/errors'

export type DuplicateEnvironmentArgs = {
  project: string
  //
  name: string
  duplicateName: string
}

type DulicateEnvironmentError =
  | SharedApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLockedError

async function duplicateEnvironment(
  client: HttpClient,
  args: DuplicateEnvironmentArgs
): Promise<ApiResponse<null, DulicateEnvironmentError>> {
  const { project, name, duplicateName } = args

  try {
    const data = await client.post<null>({
      path: `/v1/projects/${project}/environments/${name}/duplicate`,
      data: { name: duplicateName },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DulicateEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { duplicateEnvironment }
