import { ApiResponse } from '../../../../http/response'
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
  const path = `/v1/projects/${project}/environments/${environment}/duplicate`

  return await client.sendApiRequest<DuplicateEnvironmentResData, DulicateEnvironmentError>({
    method: 'POST',
    path,
    data: { name: duplicateName },
  })
}

export { duplicateEnvironment }
