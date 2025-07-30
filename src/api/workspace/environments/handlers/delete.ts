import { ApiResponse } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectContextError } from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'

export type DeleteEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>

type DeleteEnvironmentError =
  | ProjectContextError
  | EnvironmentNotFoundError
  | InvalidEnvironmentIdentifierError

async function deleteEnvironment(
  args: DeleteEnvironmentArgs
): Promise<ApiResponse<null, DeleteEnvironmentError>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}`

  return await client.sendApiRequest<null, DeleteEnvironmentError>({
    method: 'DELETE',
    path,
  })
}

export { deleteEnvironment }
