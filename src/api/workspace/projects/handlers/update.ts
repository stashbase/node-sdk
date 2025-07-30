import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  ProjectAlreadyExistsError,
  ProjectLimitReachedError,
} from '../../../../types/errors/projects'
import { GenericApiError } from '../../../../types/errors'
import { AtLeastOne } from '../../../../types/util'

type UpdateProjectError = GenericApiError | ProjectAlreadyExistsError | ProjectLimitReachedError

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
