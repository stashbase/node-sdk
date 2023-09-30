import { AxiosInstance } from 'axios'
import dotenvExpand from 'dotenv-expand'
import { printLoadedEnvTable } from '../../../utils/table'

interface Secret {
  key: string
  value: string
}

type SecretKeyValueRecord = Record<string, string>

export interface LoadEnvironmentOpts {
  enabled?: boolean
  shouldThrow?: boolean
  printTable?: boolean
}

async function loadEnvironment(
  client: AxiosInstance,
  // environmentToken: string,
  options?: LoadEnvironmentOpts
): Promise<undefined> {
  const printTable = options?.printTable
  const shouldThrow = options?.shouldThrow

  try {
    const { data } = await client.get<{ name: string; secrets: SecretKeyValueRecord }>(`/load`)
    const { name, secrets } = data

    const dotenv = {
      parsed: secrets,
    }

    dotenvExpand.expand(dotenv)

    console.log(`\nLoaded environment: ${name}`)

    if (printTable) {
      printLoadedEnvTable(secrets)
    }
  } catch (error) {
    console.log(error)

    if (shouldThrow || shouldThrow === undefined) {
      throw error
    }
  }
}

export { loadEnvironment }
