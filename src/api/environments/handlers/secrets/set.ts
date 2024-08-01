import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { createApiErrorFromResponse } from '../../../../errors'
import { SetSecretsError } from '../../../../types/errors/secrets'

type SetSecretsResponseData = null

export type SetSecretsData = Array<{
  key: Uppercase<string>
  value: string
  description?: string | null
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
  } catch (error) {
    const apiError = createApiErrorFromResponse<SetSecretsError>(error)
    return { data: null, error: apiError }
  }
}

export { setSecrets }
