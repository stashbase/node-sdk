import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  InvalidProjectIdentifierError,
  InvalidProjectNameError,
  NewProjectNameEqualsOriginal,
  ProjectAlreadyExistsError,
  ProjectDescriptionTooLongError,
  ProjectLimitReachedError,
  ProjectNameUsesIdFormatError,
} from '../../../../types/errors/projects'
import { AtLeastOne } from '../../../../types/util'
import { GenericApiError, MissingPropertiesToUpdateError } from '../../../../types/errors'

type UpdateProjectError =
  | GenericApiError
  | MissingPropertiesToUpdateError
  | NewProjectNameEqualsOriginal
  | InvalidProjectIdentifierError
  | InvalidProjectNameError
  | ProjectAlreadyExistsError
  | ProjectLimitReachedError
  | ProjectNameUsesIdFormatError
  | ProjectDescriptionTooLongError

export type UpdateProjectData = AtLeastOne<{
  /** The new name of the project */
  name: string
  /** The new description of the project */
  description: string | null
}>

export async function updateProject(
  envClient: HttpClient,
  projectNameOrId: string,
  data: UpdateProjectData
): Promise<ApiResponse<null, UpdateProjectError>> {
  return await envClient.sendApiRequest<null, UpdateProjectError>({
    method: 'PATCH',
    path: `/v1/projects/${projectNameOrId}`,
    data,
  })
}
