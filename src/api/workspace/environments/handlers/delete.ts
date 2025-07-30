import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'
import { InvalidIdentifierProjectError } from '../../../../types/errors/projects'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'

export type DeleteEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>
type DeleteEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | InvalidIdentifierProjectError
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
