import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type CreateSecretsResponseData = {
  createdCount: number
  duplicateKeys?: string[]
}

type CreateSecretsError = ApiError<
  'no_values_provided' | 'project_not_found' | 'environment_not_found'
>

export interface CreateSecretsArgs {
  project: string
  environment: string
  data: CreateSecretsData
}

export type CreateSecretsData = Array<{
  key: string
  value: string
  description?: string
}>

async function createSecrets(
  envClient: HttpClient,
  args: CreateSecretsArgs
): Promise<ApiResponse<CreateSecretsResponseData, CreateSecretsError>> {
  try {
    const { project, environment, data } = args

    const secrets = await envClient.post<CreateSecretsResponseData>({
      path: `/projects/${project}/environments/${environment}/secrets`,
      data,
    })

    return { data: secrets, error: null }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<CreateSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { createSecrets }
