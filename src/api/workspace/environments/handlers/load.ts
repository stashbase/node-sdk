import dotenvExpand from 'dotenv-expand'
import { HttpClient } from '../../../../http/client'
import { printSecretsTable } from '../../../../utils/table'
import { createApiErrorFromResponse } from '../../../../http/errors/base'
import { ApiError, ApiResponse } from '../../../../http/response'

type SecretKeyValueRecord = Record<string, string>

export interface LoadEnvironmentArgs {
  project: string
  environment: string
  // optional
  enabled?: boolean
  print?: 'key-value' | 'key' | 'none'
}

type LoadEnvironmentError = ApiError

type loadEnvironmentResponse = {
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  secrets: SecretKeyValueRecord
}

async function loadEnvironment(
  client: HttpClient,
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const { project, environment } = args

  try {
    const data = await client.get<loadEnvironmentResponse>({
      path: `/projects/${project}/environments/${environment}/load`,
    })

    const { name, secrets } = data

    if (Object.keys(secrets).length === 0) {
      console.log(`\nLoaded environment: ${name} (${data?.type})`)
      console.log(`No secrets found`)

      return { data: null, error: null }
    }

    const dotenv = {
      parsed: secrets,
    }

    dotenvExpand.expand(dotenv)

    console.log(`\nLoaded environment: ${name} (${data?.type})`)

    const printType = args?.print

    if (printType === 'key' || printType === 'key-value') {
      if (printType === 'key') {
        printSecretsTable.keys(secrets)
      } else {
        printSecretsTable.keyValues(secrets)
      }
    }

    return { data: null, error: null }
  } catch (error: any) {
    console.log('\nFailed to load environment')
    const apiError = createApiErrorFromResponse<LoadEnvironmentError>(error)

    return { data: null, error: apiError }
    //
  }
}

export { loadEnvironment }
