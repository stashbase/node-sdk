import { HttpClient } from '../../../../http/client'
import {
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
} from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { DeleteSecretsError as SharedDeleteSecretsError } from '../../../../types/errors/secrets'
import { SecretKey } from '../../../../types/secretKey'

type DeleteSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | SharedDeleteSecretsError

type DeleteSecretsResponseData = {
  deletedCount: number
  notFound?: Array<SecretKey>
}

export interface DeleteSecretsArgs {
  project: string
  environment: string
  keys: Array<Uppercase<string>>
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
