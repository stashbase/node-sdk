import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  InvalidProjectIdentifierErrorCode,
  InvalidProjectNameErrorCode,
  NewProjectNameEqualsOriginalErrorCode,
  ProjectAlreadyExistsErrorCode,
  ProjectDescriptionTooLongErrorCode,
  ProjectLimitReachedErrorCode,
  ProjectNameUsesIdFormatErrorCode,
} from '../../../../types/errors/projects'
import { AtLeastOne } from '../../../../types/util'
import { GenericApiErrorCode, MissingPropertiesToUpdateErrorCode } from '../../../../types/errors'

type UpdateProjectErrorCode =
  | GenericApiErrorCode
  | MissingPropertiesToUpdateErrorCode
  | NewProjectNameEqualsOriginalErrorCode
  | InvalidProjectIdentifierErrorCode
  | InvalidProjectNameErrorCode
  | ProjectAlreadyExistsErrorCode
  | ProjectLimitReachedErrorCode
  | ProjectNameUsesIdFormatErrorCode
  | ProjectDescriptionTooLongErrorCode

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
): Promise<ApiResponse<null, UpdateProjectErrorCode>> {
  return await envClient.sendApiRequest<null, UpdateProjectErrorCode>({
    method: 'PATCH',
    path: `/v1/projects/${projectNameOrId}`,
    data,
  })
}
