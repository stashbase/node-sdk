import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsError,
  EnvironmentLimitReachedError,
  EnvironmentNameUsesIdFormatError,
  InvalidEnvironmentNameError,
} from '../../../../types/errors/environments'
import { ProjectNotFoundError, GenericApiError } from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/aruguments'
import { CreateEnvironmentData } from '../../../../types/environments'
import { InvalidIdentifierProjectError } from '../../../../types/errors/projects'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'

export type CreateEnvironmentArgs = EnvironmentHandlerArgs<{
  data: CreateEnvironmentData
}>

interface CreateEnvironmentResponseData {
  id: string
  name: string
}

type CreateEnvironmentError =
  | GenericApiError
  | ProjectNotFoundError
  | EnvironmentAlreadyExistsError
  | EnvironmentLimitReachedError
  | InvalidEnvironmentIdentifierError
  | InvalidIdentifierProjectError
  | InvalidEnvironmentNameError
  | EnvironmentNameUsesIdFormatError

async function createEnvironment(
  args: CreateEnvironmentArgs
): Promise<ApiResponse<CreateEnvironmentResponseData, CreateEnvironmentError>> {
  const { client, project } = args
  const path = `/v1/projects/${project}/environments`

  return await client.sendApiRequest<CreateEnvironmentResponseData, CreateEnvironmentError>({
    method: 'POST',
    path,
    data: args.data,
  })
}

export { createEnvironment }
