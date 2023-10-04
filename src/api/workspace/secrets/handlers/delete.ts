import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type DeleteSecretsError = ApiError<'project_not_found' | 'environment_not_found'>

type DeleteSecretsResponseData = {
  deletedCount: number
  notFound?: string[]
}

export interface DeleteSecretsArgs {
  project: string
  environment: string
  keys: string[]
}

async function deleteSecrets(
  client: HttpClient,
  args: DeleteSecretsArgs
): Promise<ApiResponse<DeleteSecretsResponseData, DeleteSecretsError>> {
  const { project, environment, keys } = args

  try {
    const data = await client.post<DeleteSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets/delete`,
      data: {
        keys,
      },
    })

    return { data, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { deleteSecrets }
