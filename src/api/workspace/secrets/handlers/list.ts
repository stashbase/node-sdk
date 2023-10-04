import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type SecretsData = Array<{ key: string; value: string; description?: string }>
type ListSecretsError = ApiError<'project_not_found' | 'environment_not_found'>

export interface ListSecretsArgs {
  project: string
  // environment name
  name: string
  description?: boolean
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
  const { project, name } = args
  const returnDescription = args?.description

  try {
    const secrets = await envClient.get<SecretsData>({
      path: `/projects/${project}/environments/${name}/secrets`,
      query: returnDescription ? { description: 'true' } : undefined,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<ListSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { listSecrets }
