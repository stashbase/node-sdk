import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextError, GenericApiError } from '../../../../types/errors'
import { SearchSecretsError as SharedSearchSecretsError } from '../../../../types/errors/secrets'
import { EnvironmentHandlerArgs } from '../../../../types/arguments'
import {
  SearchSecretsOptions,
  SearchSecretsQueryParams,
  SearchSecretsResponse,
} from '../../../../types/secrets'

type SearchSecretsError = SharedSearchSecretsError | GenericApiError | EnvironmentContextError

export type SearchSecretsArgs = EnvironmentHandlerArgs<{ options: SearchSecretsOptions }>

async function searchSecrets(
  args: SearchSecretsArgs
): Promise<ApiResponse<SearchSecretsResponse, SearchSecretsError>> {
  const { client, project, options } = args
  const queryObj: SearchSecretsQueryParams = {}

  if (options.name) {
    queryObj.name = options.name

    if (options.returnValues === true) {
      queryObj.return_values = true
    }
  } else if (options.value) {
    queryObj.value = options.value
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  return await client.sendApiRequest<SearchSecretsResponse, SearchSecretsError>({
    method: 'GET',
    path: `/v1/projects/${project}/secrets/search`,
    query,
  })
}

export { searchSecrets }
