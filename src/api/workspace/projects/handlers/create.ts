import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  ProjectAlreadyExistsError,
  ProjectLimitReachedError,
} from '../../../../types/errors/projects'
import { GenericApiError } from '../../../../types/errors'

type CreateProjectResponseData = null

type CreateSecretsError = GenericApiError | ProjectAlreadyExistsError | ProjectLimitReachedError

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

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)
    return responseFailure(apiError)
  }
}
