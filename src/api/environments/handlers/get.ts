import { printLoadedEnvTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiResponse } from '../../../http/response'
import Unauthorized from '../../../http/errors/unauthorized'

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
  } catch (error) {
    if (error instanceof Unauthorized) {
      console.log(error)
      return { data: null, error: { code: error.code } }
    }

    // if (shouldThrow || shouldThrow === undefined) {
    throw error
    // }
  }
}

export { getEnvironment }
