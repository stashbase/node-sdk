import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { ApiError, ApiResponse } from '../../../../http/response'

type DeleteProjectsError = ApiError

type DeleteProjectsResponseData = {
  deletedCount: number
  notFound?: string[]
}

async function deleteProjects(
  client: HttpClient,
  names: string[]
): Promise<ApiResponse<DeleteProjectsResponseData, DeleteProjectsError>> {
  try {
    const data = await client.post<DeleteProjectsResponseData>({
      path: '/projects/delete',
      data: {
        names,
      },
    })

    return { data, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<DeleteProjectsError>(error)

    return { data: null, error: apiError }
  }
}

export { deleteProjects }
