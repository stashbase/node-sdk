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

type ListSecretsError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

export type ListSecretsArgs = {
  /**
   * project name
   * */
  project: string
  /**
   * environment name
   * */
  environment: string
} & ListSecretsOptions

// export interface ListSecretsOpts {
//   description?: boolean
// }
//
async function listSecrets(
  envClient: HttpClient,
  args: ListSecretsArgs
  // options?: ListSecretsOpts
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const { project, environment, omit } = args

  const queryObj: ListSecretsQueryParams = {}

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
