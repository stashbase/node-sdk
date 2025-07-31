import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { InvalidProjectIdentifierError } from '../../../../types/errors/projects'
import { Project } from '../../../../types/projects'

type GetProjectError = GenericApiError | ProjectNotFoundError | InvalidProjectIdentifierError

export async function getProject(
  client: HttpClient,
  name: string
): Promise<ApiResponse<Project, GetProjectError>> {
  return await client.sendApiRequest<Project, GetProjectError>({
    method: 'GET',
    path: `/v1/projects/${name}`,
  })
}
