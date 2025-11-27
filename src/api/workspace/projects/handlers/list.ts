import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { GenericApiError } from '../../../../types/errors'
import {
  InvalidProjectPageSizeError,
  InvalidProjectOrderError,
  InvalidProjectPageNumberError,
  InvalidProjectSearchError,
  InvalidProjectSortByError,
} from '../../../../types/errors/projects'
import { PaginationMetadata } from '../../../../types/pagination'
import { Project } from '../../../../types/projects'

export type ListProjectsOpts = {
  /** The current page number (min 1, max 1000, default 1). */
  page?: number
  /** The number of items per page (min 2, max 30, default 10). */
  pageSize?: number
  /** The field to sort by. */
  sortBy?: 'name' | 'createdAt' | 'environmentCount'
  /** Whether to sort in ascending or descending order, default: 'asc'. */
  order?: 'asc' | 'desc'
  /** A search query (min 2, max 40 characters). */
  search?: string
}

type ListProjectsResponse = {
  data: Array<Project>
  pagination: PaginationMetadata
}

type ListProjectsError =
  | GenericApiError
  | InvalidProjectPageNumberError
  | InvalidProjectPageSizeError
  | InvalidProjectSortByError
  | InvalidProjectOrderError
  | InvalidProjectSearchError

export async function listProjects(
  client: HttpClient,
  options?: ListProjectsOpts
): Promise<ApiResponse<ListProjectsResponse, ListProjectsError>> {
  const query: Record<string, string | number | boolean> = {}

  if (options?.page) {
    query.page = options.page
  }

  if (options?.pageSize) {
    query['page-size'] = options.pageSize
  }

  if (options?.search) {
    query.search = options.search
  }

  if (options?.sortBy) {
    query['sort-by'] = options.sortBy
  }

  if (options?.order) {
    query.order = options.order
  }

  return await client.sendApiRequest<ListProjectsResponse, ListProjectsError>({
    method: 'GET',
    path: `/v1/projects`,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}
