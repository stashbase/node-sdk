import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetSecretError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetSecretOptions, GetSecretQueryParams, GetSecretResData } from '../../../../types/secrets'

async function getSecret(
  envClient: HttpClient,
  key: string,
  options?: GetSecretOptions
): Promise<ApiResponse<GetSecretResData, GetSecretError>> {
  const omit = options?.omit
  const expandRefs = options?.expandRefs

  const query: GetSecretQueryParams = {}

  if (expandRefs) {
    if (!omit?.includes('value')) {
      query['expand-refs'] = true
    }
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'description').join(',')

    if (omitStr.length > 0) {
      query['omit'] = omitStr
    }
  }

  try {
    const secrets = await envClient.get<GetSecretResData>({
      path: `/v1/secrets/${key}`,
      query: Object.keys(query).length > 0 ? query : undefined,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getSecret }
