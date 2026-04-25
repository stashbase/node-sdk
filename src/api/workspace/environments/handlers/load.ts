import { printSecretsTable } from '../../../../utils/table'
import { expandAndInjectEnv } from '../../../../utils/envExpansion'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundErrorCode } from '../../../../types/errors'
import {
  LoadEnvironmentOptions,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'
import { InvalidEnvironmentIdentifierErrorCode } from '../../../../types/errors/environments'
import { ProjectContextErrorCode } from '../../../../types/errors'
import { SecretName } from '../../../../types/secrets'

type LoadEnvironmentErrorCode =
  | ProjectContextErrorCode
  | EnvironmentNotFoundErrorCode
  | InvalidEnvironmentIdentifierErrorCode

export type LoadEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  options?: LoadEnvironmentOptions
}>

async function loadEnvironment(
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentErrorCode>> {
  const { client, project, environment } = args
  const verbose = args?.options?.verbose === true

  const query: LoadEnvironmentQueryParams = {
    omit: 'comment',
    with_environment: ['name,is-production'].join(','),
  }

  if (args?.options?.expandRefs) {
    query.expand_refs = true
  }

  const { data, error } = await client.sendApiRequest<
    LoadEnvironmentResponse,
    LoadEnvironmentErrorCode
  >({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets`,
    query: query as Record<string, string | boolean>,
  })

  if (error) {
    return responseFailure(error)
  }

  if (!data) {
    return responseFailure({
      code: 'server.connection_failed',
      message: 'Could not load environment data.',
    })
  }

  const {
    environment: { isProduction },
    secrets,
  } = data

  const envType = isProduction ? 'production' : 'non-production'

  if (secrets.length === 0) {
    if (verbose) {
      console.log(`\nLoaded environment: ${environment} (${envType})`)
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
    console.log(`\nLoaded environment: ${environment} (${envType})`)
  }

  const printType = args?.options?.printSecrets

  if (printType === 'name') {
    printSecretsTable.names(secrets)
  } else if (printType === 'masked') {
    printSecretsTable.masked(secrets)
  }

  return responseSuccess(null)
}

export { loadEnvironment }
