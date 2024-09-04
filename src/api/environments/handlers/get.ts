import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import { GenericApiError } from '../../../types/errors'
import { EnvironmentWithProject } from '../../../types/environments'

type GetEnvironmentError = GenericApiError

async function getEnvironment(
  client: HttpClient
): Promise<ApiResponse<EnvironmentWithProject, GetEnvironmentError>> {
  return await client.sendApiRequest<EnvironmentWithProject, GetEnvironmentError>({
    method: 'GET',
    path: '/v1/environment',
  })
}

export { getEnvironment }
