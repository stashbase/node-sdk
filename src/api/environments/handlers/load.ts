import dotenvExpand from 'dotenv-expand'
import { printSecretsTable } from '../../../utils/table'
import { HttpClient } from '../../../http/client'
import { createApiErrorFromResponse } from '../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'
import { GenericApiError } from '../../../types/errors'
import {
  LoadEnvironmentOptions,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../types/environments'

type LoadEnvironmentError = GenericApiError

async function loadEnvironment(
  client: HttpClient,
  options?: LoadEnvironmentOptions
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const printType = options?.print

  const query: LoadEnvironmentQueryParams = {
    omit: 'description',
    'with-environment': ['name', 'type'].join(','),
  }

  if (options?.expandRefs) {
    query['expand-refs'] = true
  }

  try {
    const data = await client.get<LoadEnvironmentResponse>({
      path: '/v1/secrets',
      query: query as Record<string, string | boolean>,
    })

    const { environment, secrets } = data

    if (secrets.length === 0) {
      console.log(`\nLoaded environment: ${environment.name} (${environment.type})`)
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

    console.log(`\nLoaded environment: ${environment.name} (${environment.type})`)

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
