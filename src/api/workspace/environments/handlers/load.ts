import dotenvExpand from 'dotenv-expand'
import { HttpClient } from '../../../../http/client'
import { printSecretsTable } from '../../../../utils/table'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  SharedApiError,
} from '../../../../types/errors'

type SecretKeyValues = Array<{ key: string; value: string }>

export interface LoadEnvironmentArgs {
  project: string
  environment: string
  // optional
  enabled?: boolean
  expandRefs?: boolean
  print?: 'key-value' | 'key' | 'none'
}

type LoadEnvironmentError = SharedApiError | ProjectNotFoundError | EnvironmentNotFoundError

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

    const printType = args?.print

    if (printType === 'key' || printType === 'key-value') {
      if (printType === 'key') {
        printSecretsTable.keys(secrets)
      } else {
        printSecretsTable.keyValues(secrets)
      }
    }

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<LoadEnvironmentError>(error)
    return responseFailure(apiError)
  }
}

export { loadEnvironment }
