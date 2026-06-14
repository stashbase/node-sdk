import { HttpClient } from '../../../../http/client'
import { GetSecretErrorCode } from '../../../../types/errors/secrets'
import { ApiResponse } from '../../../../http/response'
import {
  GetSecretOptions,
  GetSecretQueryParams,
  GetSecretResponse,
} from '../../../../types/secrets'

async function getSecret(
  envClient: HttpClient,
  name: string,
  options?: GetSecretOptions
): Promise<ApiResponse<GetSecretResponse, GetSecretErrorCode>> {
  const omit = options?.omit
  const expandRefs = options?.expandRefs

  const query: GetSecretQueryParams = {}

  if (expandRefs) {
    query.expand_refs = true
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'comment').join(',')

    if (omitStr.length > 0) {
      query.omit = omitStr
    }
  }

  const path = `/v1/environment/secrets/${name}`

  return envClient.sendApiRequest<GetSecretResponse, GetSecretErrorCode>({
    method: 'GET',
    path,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { getSecret }
