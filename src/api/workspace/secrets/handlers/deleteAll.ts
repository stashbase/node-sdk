import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  GenericApiError,
  ProjectNotFoundError,
} from '../../../../types/errors'

type DeleteAllSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | GenericApiError

interface DeleteAllSecretsResponseData {
  deletedCount: number
}

export interface DeleteAllSecretsArgs {
  project: string
  environment: string
}

async function deleteAllSecrets(
  client: HttpClient,
  args: DeleteAllSecretsArgs
): Promise<ApiResponse<DeleteAllSecretsResponseData, DeleteAllSecretsError>> {
  const { project, environment } = args

  try {
    const data = await client.del<DeleteAllSecretsResponseData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets/all`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteAllSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteAllSecrets }
