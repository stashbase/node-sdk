import { ApiResponse } from '../../../../http/response'
import { EnvironmentNotFoundErrorCode, ProjectContextErrorCode } from '../../../../types/errors'
import { Environment } from '../../../../types/environments'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'
import { InvalidEnvironmentIdentifierErrorCode } from '../../../../types/errors/environments'

export type GetEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type GetEnvironmentErrorCode =
  | ProjectContextErrorCode
  | EnvironmentNotFoundErrorCode
  | InvalidEnvironmentIdentifierErrorCode

async function getEnvironment(
  args: GetEnvironmentArgs
): Promise<ApiResponse<Environment, GetEnvironmentErrorCode>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest({
    method: 'GET',
    path,
  })
}

export { getEnvironment }
