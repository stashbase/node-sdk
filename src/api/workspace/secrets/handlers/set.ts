import { SecretKey } from '../../../../types/secretKey'
import { SetSecretsResData } from '../../../../types/secrets'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { SetSecretsError as SharedSetSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type SetSecretsError = SharedSetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError

export type SetSecretsArgs = ProjectEnvHandlerArgs<{
  data: Array<SetSecretData>
}>

export type SetSecretData = {
  key: SecretKey
  value: string
  description?: string | null
}

async function setSecrets(
  args: SetSecretsArgs
): Promise<ApiResponse<SetSecretsResData, SetSecretsError>> {
  try {
    const { client, project, environment, data } = args

    const resData = await client.put<SetSecretsResData>({
      path: `/v1/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return responseSuccess(resData)
  } catch (error) {
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)
    return responseFailure(apiError)
  }
}

export { setSecrets }
