import dotenvExpand from 'dotenv-expand'
import { printSecretsTable } from '../../../../utils/table'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import {
  LoadEnvironmentOptions,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

type LoadEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

export type LoadEnvironmentArgs = SingleEnvironmentHandlerArgs<{
  options?: LoadEnvironmentOptions
}>

async function loadEnvironment(
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const { client, project, environment } = args

  const query: LoadEnvironmentQueryParams = {
    omit: 'description',
    'with-environment': ['type'].join(','),
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
    environment: { type: environmentType },
    secrets,
  } = data

  if (secrets.length === 0) {
    console.log(`\nLoaded environment: ${environment} (${environmentType})`)
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

  console.log(`\nLoaded environment: ${environment} (${environmentType})`)

  const printType = args?.options?.print

  if (printType === 'key' || printType === 'key-value') {
    if (printType === 'key') {
      printSecretsTable.keys(secrets)
    } else {
      printSecretsTable.keyValues(secrets)
    }
  }

  return responseSuccess(null)
}

export { loadEnvironment }
