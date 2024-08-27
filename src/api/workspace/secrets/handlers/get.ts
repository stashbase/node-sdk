import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { GetSecretError as SharedGetSecretsError } from '../../../../types/errors/secrets'
import { GetSecretOptions, GetSecretQueryParams, GetSecretResData } from '../../../../types/secrets'

type GetSecretError = SharedGetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError
type GetSecretResponse = Promise<ApiResponse<GetSecretResData, GetSecretError>>

export type GetSecretArgs = {
  project: string
  // environment name
  environment: string
  // secret key
  key: SecretKey
} & GetSecretOptions

async function getSecret(envClient: HttpClient, args: GetSecretArgs): GetSecretResponse {
  const { project, environment, key } = args
  const { expandRefs, omit } = args

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
    const secret = await envClient.get<GetSecretResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets/${key}`,
      query: Object.keys(query).length > 0 ? query : undefined,
    })

    return responseSuccess(secret)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getSecret }
