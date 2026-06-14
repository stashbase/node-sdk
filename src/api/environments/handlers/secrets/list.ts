import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListSecretsErrorCode as SharedListSecretsErrorCode } from '../../../../types/errors/secrets'
import {
  SecretName,
  ListSecretsOptions,
  ListSecretsResponse,
  ListSecretsQueryParams,
} from '../../../../types/secrets'

export type ListSecretsErrorCode = SharedListSecretsErrorCode

async function listSecrets(
  envClient: HttpClient,
  options?: ListSecretsOptions & { only?: SecretName[]; exclude?: SecretName[] }
): Promise<ApiResponse<ListSecretsResponse, ListSecretsErrorCode>> {
  const { omit, expandRefs, only, exclude } = options || {}

  const queryObj: ListSecretsQueryParams = {
    include_value: true,
  }

  if (expandRefs) {
    queryObj.expand_refs = true
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'comment').join(',')

    if (omitStr.length > 0) {
      queryObj.omit = omitStr
    }
  }

  if (only && only.length > 0) {
    const onlyStr = only.join(',')
    queryObj.only = onlyStr
  }

  if (exclude && exclude.length > 0) {
    const excludeStr = exclude.join(',')
    queryObj.exclude = excludeStr
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  const path = '/v1/environment/secrets'

  return envClient.sendApiRequest<ListSecretsResponse, ListSecretsErrorCode>({
    method: 'GET',
    path,
    query,
  })
}

export { listSecrets }
