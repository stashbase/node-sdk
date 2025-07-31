import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  InvalidProjectNameError,
  ProjectAlreadyExistsError,
  ProjectDescriptionTooLongError,
  ProjectLimitReachedError,
  ProjectNameUsesIdFormatError,
} from '../../../../types/errors/projects'
import { GenericApiError } from '../../../../types/errors'
import { CreateProjectResponse } from '../../../../types/projects'

type CreateProjectError =
  | GenericApiError
  | InvalidProjectNameError
  | ProjectDescriptionTooLongError
  | ProjectNameUsesIdFormatError
  | ProjectAlreadyExistsError
  | ProjectLimitReachedError

export type CreateProjectData = {
  name: string
  description?: string | null
}

export async function createProject(
  envClient: HttpClient,
  data: CreateProjectData
): Promise<ApiResponse<CreateProjectResponse, CreateProjectError>> {
  return await envClient.sendApiRequest<CreateProjectResponse, CreateProjectError>({
    method: 'POST',
    path: '/v1/projects',
    data,
  })
}
