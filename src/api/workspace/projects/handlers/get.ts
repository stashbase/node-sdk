import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { ApiError, ApiResponse } from '../../../../http/response'

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

    return { data: data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetProjectError>(error)

    return { data: null, error: apiError }
  }
}
