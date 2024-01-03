import dotenvExpand from 'dotenv-expand'
import { printSecretsTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { ApiError, ApiResponse } from '../../../http/response'
import { createApiErrorFromResponse } from '../../../http/errors/base'

type SecretKeyValueRecord = Record<string, string>

export interface LoadEnvironmentOpts {
  enabled?: boolean
  // printTable?: boolean
  print?: 'key-value' | 'key' | 'none'
}

// type LoadEnvironmentError = ApiError<EnvironmentApiError>
type LoadEnvironmentError = ApiError

async function loadEnvironmentOrThrow(
  client: HttpClient,
  options?: LoadEnvironmentOpts
): Promise<void> {
  const printType = options?.print

  try {
    const data = await client.get<{
      name: string
      type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
      secrets: SecretKeyValueRecord
    }>({
      path: '/load',
    })

    const { name, secrets } = data

    const dotenv = {
      parsed: secrets,
    }

    dotenvExpand.expand(dotenv)

    console.log(`\nLoaded environment: ${name} (${data?.type})`)

    if (printType === 'key' || printType === 'key-value') {
      if (printType === 'key') {
        printSecretsTable.keys(secrets)
      } else {
        printSecretsTable.keyValues(secrets)
      }
    }
  } catch (error: any) {
    const apiError = createApiErrorFromResponse<LoadEnvironmentError>(error)
    throw apiError
  }
}

export { loadEnvironmentOrThrow }
