import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  NewEnvironmentNameEqualsOriginal,
  EnvironmentNameUsesIdFormatError,
  InvalidEnvironmentNameError,
} from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
  MissingPropertiesToUpdateValidationError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'
import { AtLeastOne } from '../../../../types/util'
import { InvalidIdentifierProjectError } from '../../../../types/errors/projects'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'

export type UpdateEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  data: UpdateEnvironmentData
}>

export type UpdateEnvironmentData = AtLeastOne<{
  /** The new name of the project */
  name: string
  /** Whether the environment is production */
  isProduction: boolean
}>

type UpdateEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentAlreadyExistsError
  | InvalidIdentifierProjectError
  | InvalidEnvironmentIdentifierError
  | InvalidEnvironmentNameError
  | EnvironmentNameUsesIdFormatError
  | NewEnvironmentNameEqualsOriginal
  | MissingPropertiesToUpdateValidationError

export async function updateEnvironment(
  args: UpdateEnvironmentArgs
): Promise<ApiResponse<null, UpdateEnvironmentError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, UpdateEnvironmentError>({
    method: 'PATCH',
    path,
    data,
  })
}
