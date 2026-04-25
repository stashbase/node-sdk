import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import { GenericApiErrorCode } from '../../../types/errors'
import { CurrentAuthResponse } from '../../../types/auth'

type GetCurrentAuthDetailsErrorCode = GenericApiErrorCode

async function getCurrentAuthDetails(
  client: HttpClient
): Promise<ApiResponse<CurrentAuthResponse, GetCurrentAuthDetailsErrorCode>> {
  return await client.sendApiRequest<CurrentAuthResponse, GetCurrentAuthDetailsErrorCode>({
    method: 'GET',
    path: '/v1/whoami',
  })
}

export { getCurrentAuthDetails }
