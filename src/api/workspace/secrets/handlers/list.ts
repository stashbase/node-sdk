import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'

type SecretsData = Array<{ key: SecretKey; value: string; description: string | null }>
type ListSecretsError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

export interface ListSecretsArgs {
  /**
   * project name
   * */
  project: string
  /**
   * environment name
   * */
  environment: string
  /**
   * return secret description
   * */
  description?: boolean
  /**
   * expand all refered secrets to their values
   * */
  expandRefs?: boolean
}

// export interface ListSecretsOpts {
//   description?: boolean
// }
//
async function listSecrets(
  envClient: HttpClient,
  args: ListSecretsArgs
  // options?: ListSecretsOpts
): Promise<ApiResponse<SecretsData, ListSecretsError>> {
  const { project, environment } = args
  const returnDescription = args?.description

  const query: Record<string, string> = {}

  if (returnDescription) {
    query['description'] = 'true'
  }

  if (args?.expandRefs) {
    query['expand-refs'] = 'true'
  }

  try {
    const secrets = await envClient.get<SecretsData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      query,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { listSecrets }
