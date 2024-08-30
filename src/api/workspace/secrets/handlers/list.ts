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
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type ListSecretsError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

type ListSecretsBaseArgs = ProjectEnvHandlerArgs<{ opts?: ListSecretsOptions }>

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
  args: ListSecretsBaseArgs & { only?: SecretKey[]; exclude?: SecretKey[] }
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const { client, project, environment } = args
  const { only, exclude } = args

  const omit = args.opts?.omit

  const queryObj: ListSecretsQueryParams = {}

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'description').join(',')

    if (omitStr.length > 0) {
      queryObj['omit'] = omitStr
    }
  }

  if (only && only.length > 0) {
    queryObj['only'] = only.join(',')
  }

  if (exclude && exclude.length > 0) {
    queryObj['exclude'] = exclude.join(',')
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  try {
    const secrets = await client.get<ListSecretsResData>({
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
