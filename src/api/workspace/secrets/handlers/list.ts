import { HttpClient } from '../../../../http/client'
import {
  ListSecretsOptions,
  ListSecretsQueryParams,
  ListSecretsResData,
} from '../../../../types/secrets'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SecretKey } from '../../../../types/secretKey'

type ListSecretsError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

type ListSecretsBaseArgs = {
  /* Project name or id */
  project: string
  /* Environment name or id */
  environment: string
} & ListSecretsOptions

export type ListSecretsArgs = ListSecretsBaseArgs

export type ListOnlySecretsArgs = ListSecretsBaseArgs & {
  /* List only secrets with these keys */
  only: SecretKey[]
}

export type ListExcludeSecretsArgs = ListSecretsBaseArgs & {
  /* Exclude secrets with these keys */
  exclude: SecretKey[]
}

async function listSecrets(
  envClient: HttpClient,
  args: ListSecretsBaseArgs & { only?: SecretKey[]; exclude?: SecretKey[] }
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const { project, environment, omit } = args

  const queryObj: ListSecretsQueryParams = {}

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'description').join(',')

    if (omitStr.length > 0) {
      queryObj['omit'] = omitStr
    }
  }

  if (args.only && args.only.length > 0) {
    queryObj['only'] = args.only.join(',')
  }

  if (args.exclude && args.exclude.length > 0) {
    queryObj['exclude'] = args.exclude.join(',')
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  try {
    const secrets = await envClient.get<ListSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      query: query,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { listSecrets }
