import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../http/errors/base'
import { ApiError, ApiResponse } from '../../../http/response'

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

type ListProjectsError = ApiError

export async function listProjects(
  client: HttpClient,
  // TODO: make use of this options
  options?: ListProjectsOpts
): Promise<ApiResponse<Array<Project>, ListProjectsError>> {
  try {
    const data = await client.get<Array<Project>>({
      path: `projects`,
    })

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<ListProjectsError>(error)

    return { data: null, error: apiError }
  }
}
