import { printSecretsTable } from '../../../utils/table'
import { expandAndInjectEnv } from '../../../utils/envExpansion'
import { HttpClient } from '../../../http/client'
import { ApiResponse, responseFailure, responseSuccess } from '../../../http/response'
import { GenericApiErrorCode } from '../../../types/errors'
import {
  LoadEnvironmentOptions,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../types/environments'
import { SecretName } from '../../../types/secrets'

type LoadEnvironmentErrorCode = GenericApiErrorCode

async function loadEnvironment(
  client: HttpClient,
  options?: LoadEnvironmentOptions
): Promise<ApiResponse<null, LoadEnvironmentErrorCode>> {
  const printType = options?.printSecrets
  const verbose = options?.verbose === true

  const query: LoadEnvironmentQueryParams = {
    omit: 'description',
    with_environment: ['name', 'is_production'].join(','),
  }

  if (options?.expandRefs) {
    query.expand_refs = true
  }

  const { data, error } = await client.sendApiRequest<
    LoadEnvironmentResponse,
    LoadEnvironmentErrorCode
  >({
    method: 'GET',
    path: '/v1/environment/secrets',
    query: query as Record<string, string | boolean>,
  })

  if (error) {
    // console.log('\nFailed to load environment')
    // console.log(error)
    return responseFailure(error)
  }

  if (!data) {
    return responseFailure({
      code: 'server.connection_failed',
      message: 'Could not load environment data.',
    })
  }

  const { environment, secrets } = data

  const envType = environment.isProduction ? 'production' : 'non-production'

  if (secrets.length === 0) {
    if (verbose) {
      console.log(`\nLoaded environment: ${environment.name} (${envType})`)
      console.log(`No secrets found`)
    }

    return responseSuccess(null)
  }

  const secretsObj = (secrets ?? []).reduce(
    (obj: { [name: string]: string }, item: { name: SecretName; value: string }) => {
      obj[item.name] = item.value
      return obj
    },
    {}
  )

  expandAndInjectEnv(secretsObj)

  if (verbose) {
    console.log(`\nLoaded environment: ${environment.name} (${envType})`)
  }

  if (printType === 'name') {
    printSecretsTable.names(secrets)
  } else if (printType === 'masked') {
    printSecretsTable.masked(secrets)
  }

  return responseSuccess(null)
}

export { loadEnvironment }
