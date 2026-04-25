import { ApiResponse } from '../../../../http/response'
import { EnvironmentAlreadyExistsErrorCode } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundErrorCode,
  ProjectNotFoundErrorCode,
  GenericApiErrorCode,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'

export type RenameEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  newName: string
}>

type RenameEnvironmentErrorCode =
  | GenericApiErrorCode
  | ProjectNotFoundErrorCode
  | EnvironmentNotFoundErrorCode
  | EnvironmentAlreadyExistsErrorCode

async function renameEnvironment(
  args: RenameEnvironmentArgs
): Promise<ApiResponse<null, RenameEnvironmentErrorCode>> {
  const { client, project, environment, newName } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, RenameEnvironmentErrorCode>({
    method: 'PATCH',
    path,
    data: { name: newName },
  })
}

export { renameEnvironment }
