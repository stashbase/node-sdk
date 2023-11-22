import { HttpClient } from '../../../../http/client'
import { ApiError, ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../http/errors/base'

type SetSecretsResponseData = null

type SetSecretsError = ApiError<'no_values_provided'>

export type SetSecretsData = Array<{
  key: Uppercase<string>
  value: string
  description?: string
}>

async function setSecrets(
  envClient: HttpClient,
  data: SetSecretsData
): Promise<ApiResponse<SetSecretsResponseData, SetSecretsError>> {
  try {
    await envClient.post<SetSecretsResponseData>({
      path: '/secrets/set',
      data,
    })

    return { data: null, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)

    return { data: null, error: apiError }
  }
}

export { setSecrets }
