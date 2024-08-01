import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

type Project = {
  createdAt: string
  name: string
  description: string | null
}

type GetProjectError = ApiError<'project_not_found'>

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
