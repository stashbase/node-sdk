import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse } from '../../../../http/response'

type DeleteProjectsError = ApiError<'project_not_found'>

type DeleteProjectsResponseData = null

async function deleteProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<DeleteProjectsResponseData, DeleteProjectsError>> {
  try {
    const data = await client.del<DeleteProjectsResponseData>({
      path: `/v1/projects/${name}`,
    })

    return { data: null, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<DeleteProjectsError>(error)

    return { data: null, error: apiError }
  }
}

export { deleteProject }
