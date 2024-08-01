import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

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

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteProjectsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteProject }
