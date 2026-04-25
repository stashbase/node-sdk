import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import { GenericApiErrorCode } from '../../../types/errors'
import { EnvironmentWithProject } from '../../../types/environments'

type GetEnvironmentErrorCode = GenericApiErrorCode

async function getEnvironment(
  client: HttpClient
): Promise<ApiResponse<EnvironmentWithProject, GetEnvironmentErrorCode>> {
  return await client.sendApiRequest<EnvironmentWithProject, GetEnvironmentErrorCode>({
    method: 'GET',
    path: '/v1/environment',
  })
}

export { getEnvironment }
