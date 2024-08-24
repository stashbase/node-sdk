import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ListSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListSecretsQueryParams, ListSecretsResData } from '../../../../types/secrets'

export interface ListSecretsOpts {
  description?: boolean
  expandRefs?: boolean
}

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOpts
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const returnDescription = options?.description
  const expandRefs = options?.expandRefs

  const query: ListSecretsQueryParams = {}

  if (expandRefs) {
    query['expand-refs'] = true
  }

  if (returnDescription === false) {
    query['omit'] = 'description'
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
