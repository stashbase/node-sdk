import { printLoadedEnvTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiError, ApiResponse } from '../../../http/response'
import { createApiErrorFromResponse } from '../../../http/errors/base'

type SecretKeyValueRecord = Record<string, string>

export interface GetEnvironmentOpts {
  printTable?: boolean
}

interface EnvironmentData {
  name: string
  secrets: SecretKeyValueRecord
}

type GetEnvironmentError = ApiError<'unauthorized' | 'token_expired'>

async function getEnvironment(
  client: HttpClient,
  options?: GetEnvironmentOpts
): Promise<ApiResponse<EnvironmentData, GetEnvironmentError>> {
  const printTable = options?.printTable

  try {
    const data = await client.get<{ name: string; secrets: SecretKeyValueRecord }>({
      path: '/load',
    })
    const { name, secrets } = data

    if (printTable) {
      printLoadedEnvTable(secrets)
    }

    const environment: EnvironmentData = {
      name,
      secrets,
    }

    return { data: environment, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse<GetEnvironmentError>(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
