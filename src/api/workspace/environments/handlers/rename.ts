import { ApiResponse } from '../../../../http/response'
import { EnvironmentAlreadyExistsError } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type RenameEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  newName: string
}>

type RenameEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError

async function renameEnvironment(
  args: RenameEnvironmentArgs
): Promise<ApiResponse<null, RenameEnvironmentError>> {
  const { client, project, environment, newName } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, RenameEnvironmentError>({
    method: 'PATCH',
    path,
    data: { name: newName },
  })
}

export { renameEnvironment }
