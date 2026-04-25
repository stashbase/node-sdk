import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ProjectNotFoundErrorCode, GenericApiErrorCode } from '../../../../types/errors'
import { InvalidProjectIdentifierErrorCode } from '../../../../types/errors/projects'

type DeleteProjectsErrorCode = GenericApiErrorCode | ProjectNotFoundErrorCode | InvalidProjectIdentifierErrorCode

type DeleteProjectsResponseData = null

async function deleteProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<DeleteProjectsResponseData, DeleteProjectsErrorCode>> {
  return await client.sendApiRequest<DeleteProjectsResponseData, DeleteProjectsErrorCode>({
    method: 'DELETE',
    path: `/v1/projects/${name}`,
  })
}

export { deleteProject }
