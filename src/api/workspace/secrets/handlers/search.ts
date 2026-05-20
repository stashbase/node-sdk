import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode, GenericApiErrorCode } from '../../../../types/errors'
import { SearchSecretsErrorCode as SharedSearchSecretsErrorCode } from '../../../../types/errors/secrets'
import { EnvironmentHandlerArgs } from '../../../../types/arguments'
import {
  SearchSecretsOptions,
  SearchSecretsQueryParams,
  SearchSecretsResponse,
} from '../../../../types/secrets'

type SearchSecretsErrorCode =
  | SharedSearchSecretsErrorCode
  | GenericApiErrorCode
  | EnvironmentContextErrorCode

export type SearchSecretsArgs = EnvironmentHandlerArgs<{ options: SearchSecretsOptions }>

async function searchSecrets(
  args: SearchSecretsArgs
): Promise<ApiResponse<SearchSecretsResponse, SearchSecretsErrorCode>> {
  const { client, project, options } = args
  const queryObj: SearchSecretsQueryParams = {}

  if (options.name) {
    queryObj.name = options.name

    if (options.includeValues === true) {
      queryObj.include_values = true
    }
  } else if (options.value) {
    queryObj.value = options.value
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  return await client.sendApiRequest<SearchSecretsResponse, SearchSecretsErrorCode>({
    method: 'GET',
    path: `/v1/projects/${project}/secrets/search`,
    query,
  })
}

export { searchSecrets }
