import { HttpClient } from '../../../../http/client'
import { AtLeastOne } from '../../../../types/util'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateSecretsError as SharedUpdateSecretsError } from '../../../../types/errors/secrets'

interface UpdateSecretsResponseData {
  updatedCount: number
  notFoundSecrets: Array<Uppercase<string>>
}

type UpdateSecretsError = SharedUpdateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export interface UpdateSecretsArgs {
  project: string
  environment: string
  data: Array<UpdateSecretData>
}

export type UpdateSecretData = {
  key: SecretKey
} & AtLeastOne<{
  newKey: Uppercase<string>
  value: string
  description: string | null
}>

async function updateSecrets(
  envClient: HttpClient,
  args: UpdateSecretsArgs
): Promise<ApiResponse<UpdateSecretsResponseData, UpdateSecretsError>> {
  const { project, environment, data } = args

  try {
    const resData = await envClient.patch<UpdateSecretsResponseData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { updateSecrets }
