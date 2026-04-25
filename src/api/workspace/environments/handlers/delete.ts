import { ApiResponse } from '../../../../http/response'
import { EnvironmentNotFoundErrorCode, ProjectContextErrorCode } from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'
import { InvalidEnvironmentIdentifierErrorCode } from '../../../../types/errors/environments'

export type DeleteEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type DeleteEnvironmentErrorCode =
  | ProjectContextErrorCode
  | EnvironmentNotFoundErrorCode
  | InvalidEnvironmentIdentifierErrorCode

async function deleteEnvironment(
  args: DeleteEnvironmentArgs
): Promise<ApiResponse<null, DeleteEnvironmentErrorCode>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, DeleteEnvironmentErrorCode>({
    method: 'DELETE',
    path,
  })
}

export { deleteEnvironment }
