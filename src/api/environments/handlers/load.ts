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

  const { data, error } = await client.sendApiRequest<
    LoadEnvironmentResponse,
    LoadEnvironmentError
  >({
    method: 'GET',
    path: '/v1/secrets',
    query: query as Record<string, string | boolean>,
  })

  if (error) {
    // console.log('\nFailed to load environment')
    // console.log(error)
    return responseFailure(error)
  }

  const { environment, secrets } = data

  const envType = environment.isProduction ? 'production' : 'non-production'

  if (secrets.length === 0) {
    console.log(`\nLoaded environment: ${environment.name} (${envType})`)
    console.log(`No secrets found`)

    return responseSuccess(null)
  }

  const secretsObj = (secrets ?? []).reduce((obj: { [name: string]: string }, item) => {
    obj[item.name] = item.value
    return obj
  }, {})

  const dotenv = {
    parsed: secretsObj,
  }

  dotenvExpand.expand(dotenv)

  console.log(`\nLoaded environment: ${environment.name} (${envType})`)

  if (printType === 'name') {
    printSecretsTable.names(secrets)
  } else if (printType === 'masked') {
    printSecretsTable.masked(secrets)
  }

  return responseSuccess(null)
}

export { loadEnvironment }
