import { ApiResponse } from '../../../../http/response'
import {
  EnvironmentAlreadyExistsErrorCode,
  EnvironmentLimitReachedErrorCode,
  EnvironmentNameUsesIdFormatErrorCode,
  InvalidEnvironmentNameErrorCode,
} from '../../../../types/errors/environments'
import { ProjectContextErrorCode } from '../../../../types/errors'
import { EnvironmentHandlerArgs } from '../../../../types/arguments'
import { CreateEnvironmentData, CreateEnvironmentResponse } from '../../../../types/environments'
import { InvalidEnvironmentIdentifierErrorCode } from '../../../../types/errors/environments'

export type CreateEnvironmentArgs = EnvironmentHandlerArgs<{
  data: CreateEnvironmentData
}>

type CreateEnvironmentErrorCode =
  | ProjectContextErrorCode
  | EnvironmentAlreadyExistsErrorCode
  | EnvironmentLimitReachedErrorCode
  | InvalidEnvironmentIdentifierErrorCode
  | InvalidEnvironmentNameErrorCode
  | EnvironmentNameUsesIdFormatErrorCode

async function createEnvironment(
  args: CreateEnvironmentArgs
): Promise<ApiResponse<CreateEnvironmentResponse, CreateEnvironmentErrorCode>> {
  const { client, project } = args
  const path = `/v1/projects/${project}/environments`

  return await client.sendApiRequest<CreateEnvironmentResponse, CreateEnvironmentErrorCode>({
    method: 'POST',
    path,
    data: args.data,
  })
}

export { createEnvironment }
