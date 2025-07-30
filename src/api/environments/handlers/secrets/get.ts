import { HttpClient } from '../../../../http/client'
import { GetSecretError } from '../../../../types/errors/secrets'
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
): Promise<ApiResponse<GetSecretResponse, GetSecretError>> {
  const omit = options?.omit
  const expandRefs = options?.expandRefs

  const query: GetSecretQueryParams = {}

  if (expandRefs) {
    if (!omit?.includes('value')) {
      query['expand-refs'] = true
    }
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'comment').join(',')

    if (omitStr.length > 0) {
      query['omit'] = omitStr
    }
  }

  const path = `/v1/secrets/${name}`

  return envClient.sendApiRequest<GetSecretResponse, GetSecretError>({
    method: 'GET',
    path,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { getSecret }
