import { ApiResponse } from '../../../../http/response'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'
import { EnvironmentType } from '../../../../types/environments'

type NewType = SingleEnvironmentHandlerArgs<{
  type: EnvironmentType
}>

export type UpdateEnvironmentTypeArgs = NewType

type UpdateEnvironmentTypeError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function updateEnvironmentType(
  args: UpdateEnvironmentTypeArgs
): Promise<ApiResponse<null, UpdateEnvironmentTypeError>> {
  const { client, project, environment, type } = args

  const path = `/v1/projects/${project}/environments/${environment}`
  return await client.sendApiRequest<null, UpdateEnvironmentTypeError>({
    method: 'PATCH',
    path,
    data: { type },
  })
}

export { updateEnvironmentType }
