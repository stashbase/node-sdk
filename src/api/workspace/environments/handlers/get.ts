import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { Environment } from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type GetEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type GetEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

async function getEnvironment(
  args: GetEnvironmentArgs
): Promise<ApiResponse<Environment, GetEnvironmentError>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest({
    method: 'GET',
    path,
  })
}

export { getEnvironment }
