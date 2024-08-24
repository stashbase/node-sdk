import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetSecretError } from '../../../../types/errors/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetSecretResData } from '../../../../types/secrets'

async function getSecret(
  envClient: HttpClient,
  key: string,
  expandRefs?: boolean
): Promise<ApiResponse<GetSecretResData, GetSecretError>> {
  try {
    const secrets = await envClient.get<GetSecretResData>({
      path: `/v1/secrets/${key}`,
      query: expandRefs ? { 'expand-refs': 'true' } : undefined,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getSecret }
