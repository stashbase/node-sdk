import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GenericApiError } from '../../../../types/errors'
import { PaginationMetadata } from '../../../../types/pagination'
import { Project } from '../../../../types/projects'

export type ListProjectsOpts = {
  /** The current page number (min 1, max 1000, default 1). */
  page?: number
  /** The number of items per page (min 2, max 30, default 10). */
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
