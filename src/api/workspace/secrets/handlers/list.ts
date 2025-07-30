import {
  SecretName,
  ListSecretsOptions,
  ListSecretsResData,
  ListSecretsQueryParams,
} from '../../../../types/secrets'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextError, GenericApiError } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import {
  InvalidSecretNamesValidationError,
  NoDataProvidedValidationError,
} from '../../../../types/errors/secrets'

type ListSecretsError =
  | GenericApiError
  | EnvironmentContextError
  | InvalidSecretNamesValidationError
  | NoDataProvidedValidationError

type ListSecretsBaseArgs = ProjectEnvHandlerArgs<{ options?: ListSecretsOptions }>

export type ListSecretsArgs = ListSecretsBaseArgs

export type ListOnlySecretsArgs = ListSecretsBaseArgs & {
  /* List only secrets with these names */
  only: SecretName[]
}

export type ListExcludeSecretsArgs = ListSecretsBaseArgs & {
  /* Exclude secrets with these names */
  exclude: SecretName[]
}

async function listSecrets(
  args: ListSecretsBaseArgs & { only?: SecretName[]; exclude?: SecretName[] }
): Promise<ApiResponse<ListSecretsResData, ListSecretsError>> {
  const { client, project, environment } = args
  const { only, exclude } = args

  const omit = args.options?.omit

  const queryObj: ListSecretsQueryParams = {}

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'comment').join(',')

    if (omitStr.length > 0) {
      queryObj['omit'] = omitStr
    }
  }

  if (only && only.length > 0) {
    queryObj['only'] = only.join(',')
  }

  if (exclude && exclude.length > 0) {
    queryObj['exclude'] = exclude.join(',')
  }

  const query =
    Object.keys(queryObj).length > 0 ? (queryObj as Record<string, string | boolean>) : undefined

  const path = `/v1/projects/${project}/environments/${environment}/secrets`

  return await client.sendApiRequest<ListSecretsResData, ListSecretsError>({
    method: 'GET',
    path,
    query,
  })
}

export { listSecrets }
