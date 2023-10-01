import dotenvExpand from 'dotenv-expand'
import { printLoadedEnvTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiError, ApiResponse } from '../../../http/response'
import { createApiErrorFromResponse } from '../../../http/errors/base'

type SecretKeyValueRecord = Record<string, string>

export interface LoadEnvironmentOpts {
  enabled?: boolean
  printTable?: boolean
}

type LoadEnvironmentError = ApiError<'unauthorized' | 'token_expired'>

async function loadEnvironment(
  client: HttpClient,
  options?: LoadEnvironmentOpts
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const printTable = options?.printTable

  try {
    const data = await client.get<{ name: string; secrets: SecretKeyValueRecord }>({
      path: '/load',
    })

    const { name, secrets } = data

    if (Object.keys(secrets).length === 0) {
      console.log(`\nLoaded environment: ${name}`)
      console.log(`No secrets found`)

      return { data: null, error: null }
    }

    const dotenv = {
      parsed: secrets,
    }

    dotenvExpand.expand(dotenv)

    console.log(`\nLoaded environment: ${name}`)

    if (printTable) {
      printLoadedEnvTable(secrets)
    }

    return { data: null, error: null }
  } catch (error) {
    console.log('\nFailed to load environment')
    console.log(error)

    const apiError = createApiErrorFromResponse<LoadEnvironmentError>(error)

    return { data: null, error: apiError }

    // if (shouldThrow || shouldThrow === undefined) {
    //   throw error
    // }
  }
}

export { loadEnvironment }
