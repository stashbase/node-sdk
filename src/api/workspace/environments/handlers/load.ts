import dotenvExpand from 'dotenv-expand'
import { HttpClient } from '../../../../http/client'
import { printSecretsTable } from '../../../../utils/table'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import {
  LoadEnvironmentOpts,
  LoadEnvironmentQueryParams,
  LoadEnvironmentResponse,
} from '../../../../types/environments'

type LoadEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

export type LoadEnvironmentArgs = {
  project: string
  environment: string
} & LoadEnvironmentOpts

async function loadEnvironment(
  client: HttpClient,
  args: LoadEnvironmentArgs
): Promise<ApiResponse<null, LoadEnvironmentError>> {
  const { project, environment: environmentName } = args

  const query: LoadEnvironmentQueryParams = {
    omit: 'description',
    'with-environment': ['type'].join(','),
  }

  if (args?.expandRefs) {
    query['expand-refs'] = true
  }

  try {
    const data = await client.get<LoadEnvironmentResponse>({
      path: `/v1/projects/${project}/environments/${environmentName}/secrets`,
      query: query as Record<string, string | boolean>,
    })

    const {
      environment: { type: environmentType },
      secrets,
    } = data

    if (secrets.length === 0) {
      console.log(`\nLoaded environment: ${environmentName} (${environmentType})`)
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

    console.log(`\nLoaded environment: ${environmentName} (${environmentType})`)

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
