import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ProjectNotFoundErrorCode, GenericApiErrorCode } from '../../../../types/errors'
import { InvalidProjectIdentifierErrorCode } from '../../../../types/errors/projects'
import { Project } from '../../../../types/projects'

type GetProjectErrorCode = GenericApiErrorCode | ProjectNotFoundErrorCode | InvalidProjectIdentifierErrorCode

export async function getProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<Project, GetProjectErrorCode>> {
  return await client.sendApiRequest<Project, GetProjectErrorCode>({
    method: 'GET',
    path: `/v1/projects/${name}`,
  })
}
