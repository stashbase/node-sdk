import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

export type DeleteEnvironmentArgs = SingleEnvironmentHandlerArgs<undefined>
type DeleteEnvironmentError = GenericApiError | ProjectNotFoundError | EnvironmentNotFoundError

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
