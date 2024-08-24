import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { DeleteAllSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  GenericApiError,
  ProjectNotFoundError,
} from '../../../../types/errors'

type DeleteAllSecretsError = ProjectNotFoundError | EnvironmentNotFoundError | GenericApiError

export interface DeleteAllSecretsArgs {
  project: string
  environment: string
}

async function deleteAllSecrets(
  client: HttpClient,
  args: DeleteAllSecretsArgs
): Promise<ApiResponse<DeleteAllSecretsResData, DeleteAllSecretsError>> {
  const { project, environment } = args

  try {
    const data = await client.del<DeleteAllSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets/all`,
    })

    return responseSuccess(data)
  } catch (error) {
    const apiError = createApiErrorFromResponse<DeleteAllSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { deleteAllSecrets }
