import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ListSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  ListSecretsOptions,
  ListSecretsQueryParams,
  ListSecretsResData,
} from '../../../../types/secrets'

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOptions
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const omit = options?.omit
  const expandRefs = options?.expandRefs

  const queryObj: ListSecretsQueryParams = {}

  if (expandRefs) {
    queryObj['expand-refs'] = true
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'description').join(',')

    if (omitStr.length > 0) {
      queryObj['omit'] = omitStr
    }
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  try {
    const secrets = await envClient.get<ListSecretsResData>({
      path: '/v1/secrets',
      query,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { listSecrets }
