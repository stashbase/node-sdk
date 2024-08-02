import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { SharedApiError } from '../../../../types/errors'

// TODO:
export type ListProjectsOpts = {
  page?: number
  perPage?: number
}

type Project = {
  createdAt: string
  name: string
  description: string | null
}

type ListProjectsError = SharedApiError

export async function listProjects(
  client: HttpClient,
  // TODO: make use of this options
  options?: ListProjectsOpts
): Promise<ApiResponse<Array<Project>, ListProjectsError>> {
  try {
    const data = await client.get<Array<Project>>({
      path: `/v1/projects`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListProjectsError>(error)
    return responseFailure(apiError)
  }
}
