import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ListSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListSecretsQueryParams, ListSecretsResData } from '../../../../types/secrets'

export interface ListSecretsOpts {
  expandRefs?: boolean
  omit?: Array<'value' | 'description'>
}

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOpts
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const omit = options?.omit
  const expandRefs = options?.expandRefs

  const query: ListSecretsQueryParams = {}

  if (expandRefs) {
    query['expand-refs'] = true
  }

  if (omit) {
    query['omit'] = omit.join(',')
  }

  try {
    const secrets = await envClient.get<ListSecretsResData>({
      path: '/v1/secrets',
      query: query as Record<string, string | boolean>,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { listSecrets }
