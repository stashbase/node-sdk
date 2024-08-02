import { HttpClient } from '../../../../http/client'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { DeleteSecretsError as SharedDeleteSecretsError } from '../../../../types/errors/secrets'

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

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteSecrets }
