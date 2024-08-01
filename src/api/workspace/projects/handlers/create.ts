import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse } from '../../../../http/response'

type CreateProjectResponseData = null

type CreateSecretsError = ApiError<'project_already_exists' | 'project_limit_reached'>

export type CreateProjectData = {
  name: string
  description?: string
}

export async function createProject(
  envClient: HttpClient,
  data: CreateProjectData
): Promise<ApiResponse<CreateProjectResponseData, CreateSecretsError>> {
  try {
    await envClient.post<CreateProjectResponseData>({
      path: '/v1/projects',
      data,
    })

    return { data: null, error: null }
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)
    return { data: null, error: apiError }
  }
}
