import { printLoadedEnvTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import Unauthorized from '../../../http/errors/unauthorized'
import { getCustomError } from '../../../http/errors/getError'
import { createApiErrorFromResponse } from '../../../http/errors/base'

type SecretKeyValueRecord = Record<string, string>

export interface GetEnvironmentOpts {
  printTable?: boolean
}

interface GetEnvironmentData {
  name: string
  secrets: SecretKeyValueRecord
}

async function getEnvironment(
  client: HttpClient,
  options?: GetEnvironmentOpts
): Promise<ApiResponse<GetEnvironmentData>> {
  const printTable = options?.printTable

  try {
    const data = await client.get<{ name: string; secrets: SecretKeyValueRecord }>({
      path: '/load',
    })
    const { name, secrets } = data

    if (printTable) {
      printLoadedEnvTable(secrets)
    }

    const environment: GetEnvironmentData = {
      name,
      secrets,
    }

    return { data: environment, error: null }
  } catch (error: any) {
    console.log('Error: ', error?.error)
    const apiError = createApiErrorFromResponse(error)

    return { data: null, error: apiError }
  }
}

export { getEnvironment }
