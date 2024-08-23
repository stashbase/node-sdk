import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GenericApiError } from '../../../../types/errors'
import { PaginationMetadata } from '../../../../types/pagination'
import { Project } from '../../../../types/projects'

// TODO: other options
export type ListProjectsOpts = {
  page?: number
  limit?: number
}

type ListProjectsResponse = {
  data: Array<Project>
  pagination: PaginationMetadata
}

type ListProjectsError = GenericApiError

export async function listProjects(
  client: HttpClient,
  options?: ListProjectsOpts
): Promise<ApiResponse<ListProjectsResponse, ListProjectsError>> {
  try {
    const data = await client.get<ListProjectsResponse>({
      path: `/v1/projects`,
      query: options,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListProjectsError>(error)
    return responseFailure(apiError)
  }
}
