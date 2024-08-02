import dotenvExpand from 'dotenv-expand'
import { printSecretsTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'
import { SharedApiError } from '../../../types/errors'

type SecretKeyValues = Array<{ key: string; value: string }>

export interface LoadEnvironmentOpts {
  enabled?: boolean
  // printTable?: boolean
  print?: 'key-value' | 'key' | 'none'
  expandRefs?: boolean
}

// type LoadEnvironmentError = ApiError<EnvironmentApiError>
type LoadEnvironmentError = SharedApiError

async function loadEnvironment(
  client: HttpClient,
  options?: LoadEnvironmentOpts
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const printType = options?.print

  try {
    const data = await client.get<{
      name: string
      type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
      secrets: SecretKeyValues
    }>({
      path: '/load',
      query: options?.expandRefs ? { 'expand-refs': 'true' } : undefined,
    })

    const { name, secrets } = data

    if (secrets.length === 0) {
      console.log(`\nLoaded environment: ${name}`)
      console.log(`No secrets found`)

      return responseSuccess(null)
    }

    const secretsObj = (secrets ?? []).reduce((obj: { [key: string]: string }, item) => {
      obj[item.key] = item.value
      return obj
    }, {})

    const dotenv = {
      parsed: secretsObj,
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

    return responseSuccess(null)
  } catch (error: any) {
    console.log('\nFailed to load environment')
    console.log(error)

    const apiError = createApiErrorFromResponse<LoadEnvironmentError>(error)
    return responseFailure(apiError)

    // if (shouldThrow || shouldThrow === undefined) {
    //   throw error
    // }
  }
}

export { loadEnvironment }
