import { ApiResponse } from '../../../../http/response'
import { EnvironmentLockedError } from '../../../../types/errors/environments'
import {
  EnvironmentNotFoundError,
  ProjectNotFoundError,
  GenericApiError,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/aruguments'

type SetIsProductionArgs = SingleEnvironmentHandlerArgs<{
  isProduction: boolean
}>

type SetIsProductionError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentNotFoundError
  | EnvironmentLockedError

async function setIsProduction(
  args: SetIsProductionArgs
): Promise<ApiResponse<null, SetIsProductionError>> {
  const { client, project, environment, isProduction } = args

  const path = `/v1/projects/${project}/environments/${environment}`
  return await client.sendApiRequest<null, SetIsProductionError>({
    method: 'PATCH',
    path,
    data: { isProduction },
  })
}

export { setIsProduction }
