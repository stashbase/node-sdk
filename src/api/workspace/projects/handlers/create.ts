import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import {
  ProjectAlreadyExistsError,
  ProjectLimitReachedError,
} from '../../../../types/errors/projects'
import { GenericApiError } from '../../../../types/errors'

interface CreateProjectResponseData {
  id: string
  name: string
}

type CreateSecretsError = GenericApiError | ProjectAlreadyExistsError | ProjectLimitReachedError

export type CreateProjectData = {
  name: string
  description?: string | null
}

export async function createProject(
  envClient: HttpClient,
  data: CreateProjectData
): Promise<ApiResponse<CreateProjectResponseData, CreateSecretsError>> {
  return await envClient.sendApiRequest<CreateProjectResponseData, CreateSecretsError>({
    method: 'POST',
    path: '/v1/projects',
    data,
  })
}
