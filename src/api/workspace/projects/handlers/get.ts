import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectNotFoundError, SharedApiError } from '../../../../types/errors'

type Project = {
  createdAt: string
  name: string
  description: string | null
}

type GetProjectError = SharedApiError | ProjectNotFoundError

export async function getProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<Project, GetProjectError>> {
  try {
    const data = await client.get<Project>({
      path: `/v1/projects/${name}`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetProjectError>(error)
    return responseFailure(apiError)
  }
}
