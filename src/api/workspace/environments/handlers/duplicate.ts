import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLockedError,
} from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type DuplicateEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  duplicateName: string
}>

type DulicateEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLockedError

interface DuplicateEnvironmentResData {
  id: string
  name: string
}

async function duplicateEnvironment(
  args: DuplicateEnvironmentArgs
): Promise<ApiResponse<DuplicateEnvironmentResData, DulicateEnvironmentError>> {
  const { client, project, environment, duplicateName } = args

  try {
    const data = await client.post<DuplicateEnvironmentResData>({
      path: `/v1/projects/${project}/environments/${environment}/duplicate`,
      data: { name: duplicateName },
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DulicateEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { duplicateEnvironment }
