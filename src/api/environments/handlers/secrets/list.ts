import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ListSecretsError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export interface ListSecretsOpts {
  description?: boolean
  expandRefs?: boolean
}

type SecretsData = Array<{ key: Uppercase<string>; value: string; description?: string }>

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOpts
): Promise<ApiResponse<SecretsData, ListSecretsError>> {
  const returnDescription = options?.description
  const expandRefs = options?.expandRefs

  const query: Record<string, string> = {}

  if (expandRefs) {
    query['expand-refs'] = 'true'
  }

  if (returnDescription) {
    query['description'] = 'true'
  }

  try {
    const secrets = await envClient.get<SecretsData>({
      path: '/secrets/list',
      query,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { listSecrets }
