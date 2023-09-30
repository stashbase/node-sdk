import { AxiosInstance } from 'axios'
import { printLoadedEnvTable } from '../../../utils/table'

type SecretKeyValueRecord = Record<string, string>

export interface GetEnvironmentOpts {
  printTable?: boolean
}

interface GetEnvironmentData {
  name: string
  secrets: SecretKeyValueRecord
}

async function getEnvironment(
  client: AxiosInstance,
  options?: GetEnvironmentOpts
): Promise<GetEnvironmentData> {
  const printTable = options?.printTable

  try {
    const { data } = await client.get<{ name: string; secrets: SecretKeyValueRecord }>(`/load`)
    const { name, secrets } = data

    if (printTable) {
      printLoadedEnvTable(secrets)
    }

    const environment: GetEnvironmentData = {
      name,
      secrets,
    }

    return environment
  } catch (error) {
    console.log(error)

    // if (shouldThrow || shouldThrow === undefined) {
    throw error
    // }
  }
}

export { getEnvironment }
