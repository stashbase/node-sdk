import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLimitReachedError,
  EnvironmentNameUsesIdFormatError,
  InvalidEnvironmentNameError,
} from '../../../../types/errors/environments'
import { ProjectContextError } from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'
import { CreateEnvironmentData, CreateEnvironmentResponse } from '../../../../types/environments'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'

export type CreateEnvironmentArgs = EnvironmentHandlerArgs<{
  data: CreateEnvironmentData
}>

type CreateEnvironmentError =
  | ProjectContextError
  | EnvironmentAlreadyExistsError
  | EnvironmentLimitReachedError
  | InvalidEnvironmentIdentifierError
  | InvalidEnvironmentNameError
  | EnvironmentNameUsesIdFormatError

async function createEnvironment(
  args: CreateEnvironmentArgs
): Promise<ApiResponse<CreateEnvironmentResponse, CreateEnvironmentError>> {
  const { client, project } = args
  const path = `/v1/projects/${project}/environments`

  return await client.sendApiRequest<CreateEnvironmentResponse, CreateEnvironmentError>({
    method: 'POST',
    path,
    data: args.data,
  })
}

export { createEnvironment }
