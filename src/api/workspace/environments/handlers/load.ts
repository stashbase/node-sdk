import dotenvExpand from 'dotenv-expand'
import { HttpClient } from '../../../../http/client'
import { printSecretsTable } from '../../../../utils/table'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiError, ApiResponse } from '../../../../http/response'

type SecretKeyValues = Array<{ key: string; value: string }>

export interface LoadEnvironmentArgs {
  project: string
  environment: string
  // optional
  enabled?: boolean
  expandRefs?: boolean
  print?: 'key-value' | 'key' | 'none'
}

type LoadEnvironmentError = ApiError

type loadEnvironmentResponse = {
  name: string
  type: 'DEVELOPMENT' | 'TESTING' | 'STAGING' | 'PRODUCTION'
  secrets: SecretKeyValues
}

async function loadEnvironment(
  client: HttpClient,
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const { project, environment } = args

  try {
    const data = await client.get<loadEnvironmentResponse>({
      path: `/v1/projects/${project}/environments/${environment}/load`,
      query: args.expandRefs ? { 'expand-refs': 'true' } : undefined,
    })

    const { name, secrets } = data

    if (secrets.length === 0) {
      console.log(`\nLoaded environment: ${name} (${data?.type})`)
      console.log(`No secrets found`)

      return { data: null, error: null }
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
