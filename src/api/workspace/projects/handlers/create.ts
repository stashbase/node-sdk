import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  InvalidProjectNameErrorCode,
  ProjectAlreadyExistsErrorCode,
  ProjectDescriptionTooLongErrorCode,
  ProjectLimitReachedErrorCode,
  ProjectNameUsesIdFormatErrorCode,
} from '../../../../types/errors/projects'
import { GenericApiErrorCode } from '../../../../types/errors'
import { Project } from '../../../../types/projects'

type CreateProjectErrorCode =
  | GenericApiErrorCode
  | InvalidProjectNameErrorCode
  | ProjectDescriptionTooLongErrorCode
  | ProjectNameUsesIdFormatErrorCode
  | ProjectAlreadyExistsErrorCode
  | ProjectLimitReachedErrorCode

export type CreateProjectData = {
  name: string
  description?: string | null
}

export async function createProject(
  envClient: HttpClient,
  data: CreateProjectData
): Promise<ApiResponse<Project, CreateProjectErrorCode>> {
  return await envClient.sendApiRequest<Project, CreateProjectErrorCode>({
    method: 'POST',
    path: '/v1/projects',
    data,
  })
}
