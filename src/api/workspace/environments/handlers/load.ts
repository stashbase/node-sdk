import dotenvExpand from 'dotenv-expand'
import { printSecretsTable } from '../../../../utils/table'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError } from '../../../../types/errors'
import {
  LoadEnvironmentOptions,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'
import { ProjectContextError } from '../../../../types/errors'

type LoadEnvironmentError =
  | ProjectContextError
  | EnvironmentNotFoundError
  | InvalidEnvironmentIdentifierError

export type LoadEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  options?: LoadEnvironmentOptions
}>

async function loadEnvironment(
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const { client, project, environment } = args

  const query: LoadEnvironmentQueryParams = {
    omit: 'comment',
    'with-environment': ['name,is-production'].join(','),
  }

  if (args?.options?.expandRefs) {
    query['expand-refs'] = true
  }

  const { data, error } = await client.sendApiRequest<
    LoadEnvironmentResponse,
    LoadEnvironmentError
  >({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets`,
    query: query as Record<string, string | boolean>,
  })

  if (error) {
    return responseFailure(error)
  }

  const {
    environment: { isProduction },
    secrets,
  } = data

  const envType = isProduction ? 'production' : 'non-production'

  if (secrets.length === 0) {
    console.log(`\nLoaded environment: ${environment} (${envType})`)
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

  console.log(`\nLoaded environment: ${environment} (${envType})`)

  const printType = args?.options?.printSecrets

  if (printType === 'name') {
    printSecretsTable.names(secrets)
  } else if (printType === 'masked') {
    printSecretsTable.masked(secrets)
  }

  return responseSuccess(null)
}

export { loadEnvironment }
