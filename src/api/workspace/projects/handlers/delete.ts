import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'

type DeleteProjectsError = GenericApiError | ProjectNotFoundError

type DeleteProjectsResponseData = null

async function deleteProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<DeleteProjectsResponseData, DeleteProjectsError>> {
  return await client.sendApiRequest<DeleteProjectsResponseData, DeleteProjectsError>({
    method: 'DELETE',
    path: `/v1/projects/${name}`,
  })
}

export { deleteProject }
