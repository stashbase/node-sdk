import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'

type DeleteProjectsError = GenericApiError | ProjectNotFoundError

type DeleteProjectsResponseData = null

async function deleteProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<DeleteProjectsResponseData, DeleteProjectsError>> {
  try {
    await client.del<DeleteProjectsResponseData>({
      path: `/v1/projects/${name}`,
    })

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteProjectsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteProject }
