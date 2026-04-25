import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentNotFoundErrorCode,
  ProjectNotFoundErrorCode,
  GenericApiErrorCode,
} from '../../../../types/errors'
import { SingleEnvironmentHandlerArgs } from '../../../../types/arguments'

type SetIsProductionArgs = SingleEnvironmentHandlerArgs<{
  isProduction: boolean
}>

type SetIsProductionErrorCode = GenericApiErrorCode | ProjectNotFoundErrorCode | EnvironmentNotFoundErrorCode

async function setIsProduction(
  args: SetIsProductionArgs
): Promise<ApiResponse<null, SetIsProductionErrorCode>> {
  const { client, project, environment, isProduction } = args

  const path = `/v1/projects/${project}/environments/${environment}`
  return await client.sendApiRequest<null, SetIsProductionErrorCode>({
    method: 'PATCH',
    path,
    data: { isProduction },
  })
}

export { setIsProduction }
