import { HttpClient } from '../../../../http/client'
import {
  ApiError,
  ApiResponse,
  EnvironmentNotFoundError,
  ProjectNotFoundError,
} from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { AtLeastOne } from '../../../../utils/types'

type UpdateSecretsResponseData = {
  updatedCount: number
  notFoundKeys?: Array<Uppercase<string>>
}

type UpdateSecretsError =
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | ApiError<'no_values_provided'>
  | ApiError<'missing_properties_to_update', { secretKeys: Array<Uppercase<string>> }>
  | ApiError<'invalid_secret_keys', { secretKeys: Array<Uppercase<string>> }>
  | ApiError<'invalid_new_secret_keys', { newSecretKeys: Array<Uppercase<string>> }>
  | ApiError<'duplicate_secrets', { duplicateSecrets: Array<Uppercase<string>> }>
  | ApiError<'duplicate_new_secrets', { duplicateSecrets: Array<Uppercase<string>> }>
  | ApiError<'self_referencing_secrets', { secrets: Array<Uppercase<string>> }>
  | ApiError<'new_key_secrets_already_exist', { conflictingSecrets: Array<Uppercase<string>> }>

export interface UpdateSecretsArgs {
  project: string
  environment: string
  data: Array<UpdateSecretData>
}

export type UpdateSecretData = {
  key: Uppercase<string>
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

    return { data: secrets, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<UpdateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { updateSecrets }
