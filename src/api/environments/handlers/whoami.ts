import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import { GenericApiError } from '../../../types/errors'
import { CurrentAuthResponse } from '../../../types/auth'

type GetCurrentAuthDetailsError = GenericApiError

async function getCurrentAuthDetails(
  client: HttpClient
): Promise<ApiResponse<CurrentAuthResponse, GetCurrentAuthDetailsError>> {
  return await client.sendApiRequest<CurrentAuthResponse, GetCurrentAuthDetailsError>({
    method: 'GET',
    path: '/v1/whoami',
  })
}

export { getCurrentAuthDetails }
