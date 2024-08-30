import { AtLeastOne } from '../../../../types/util'
import { SecretKey } from '../../../../types/secretKey'
import { createApiErrorFromResponse } from '../../../../errors'
import { UpdateSecretsResData } from '../../../../types/secrets'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateSecretsError as SharedUpdateSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type UpdateSecretsError = SharedUpdateSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export type UpdateSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<UpdateSecretData>
}>

export type UpdateSecretData = {
  key: SecretKey
} & AtLeastOne<{
  newKey: Uppercase<string>
  value: string
  description: string | null
}>

async function updateSecrets(
  args: UpdateSecretsArgs
): Promise<ApiResponse<UpdateSecretsResData, UpdateSecretsError>> {
  const { client, project, environment, data } = args

  try {
    const resData = await client.patch<UpdateSecretsResData>({
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
