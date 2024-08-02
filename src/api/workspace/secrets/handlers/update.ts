import { HttpClient } from '../../../../http/client'
import {
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  responseFailure,
  responseSuccess,
} from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../errors'
import { AtLeastOne } from '../../../../utils/types'
import { SecretKey } from '../../../../types/secretKey'
import { UpdateSecretsError as SharedUpdateSecretsError } from '../../../../types/errors/secrets'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
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
    const secrets = await envClient.patch<UpdateSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return responseSuccess(secrets)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { updateSecrets }
