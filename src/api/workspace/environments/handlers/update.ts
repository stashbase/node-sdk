import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsErrorCode,
  NewEnvironmentNameEqualsOriginalErrorCode,
  EnvironmentNameUsesIdFormatErrorCode,
  InvalidEnvironmentNameErrorCode,
  EnvironmentDescriptionTooLongErrorCode,
} from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundErrorCode,
  MissingPropertiesToUpdateErrorCode,
  ProjectContextErrorCode,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'
import { AtLeastOne } from '../../../../types/util'
import { InvalidEnvironmentIdentifierErrorCode } from '../../../../types/errors/environments'

export type UpdateEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  data: UpdateEnvironmentData
}>

export type UpdateEnvironmentData = AtLeastOne<{
  /** The new name of the project */
  name: string
  /** Whether the environment is production */
  isProduction: boolean
  /** The new description of the environment */
  description: string
}>

type UpdateEnvironmentErrorCode =
  | ProjectContextErrorCode
  | EnvironmentNotFoundErrorCode
  | EnvironmentAlreadyExistsErrorCode
  | InvalidEnvironmentIdentifierErrorCode
  | InvalidEnvironmentNameErrorCode
  | EnvironmentNameUsesIdFormatErrorCode
  | NewEnvironmentNameEqualsOriginalErrorCode
  | MissingPropertiesToUpdateErrorCode
  | EnvironmentDescriptionTooLongErrorCode

export async function updateEnvironment(
  args: UpdateEnvironmentArgs
): Promise<ApiResponse<null, UpdateEnvironmentErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, UpdateEnvironmentErrorCode>({
    method: 'PATCH',
    path,
    data,
  })
}
