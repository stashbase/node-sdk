import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { InvalidIdentifierProjectError } from '../../../../types/errors/projects'

type DeleteProjectsError = GenericApiError | ProjectNotFoundError | InvalidIdentifierProjectError

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
