import { ApiResponse } from '../../../../http/response'
import {
  GetSecretOptions,
  GetSecretQueryParams,
  GetSecretResData,
  SecretName,
} from '../../../../types/secrets'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { GetSecretError as SharedGetSecretsError } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

type GetSecretError = SharedGetSecretsError | ProjectNotFoundError | EnvironmentNotFoundError
type GetSecretResponse = Promise<ApiResponse<GetSecretResData, GetSecretError>>

export type GetSecretArgs = ProjectEnvHandlerArgs<{
  name: SecretName
  options?: GetSecretOptions
}>

async function getSecret(args: GetSecretArgs): GetSecretResponse {
  const { client, project, environment, name } = args
  const omit = args.options?.omit
  const expandRefs = args.options?.expandRefs

  const query: GetSecretQueryParams = {}

  if (expandRefs) {
    if (!omit?.includes('value')) {
      query['expand-refs'] = true
    }
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'description').join(',')

    if (omitStr.length > 0) {
      query['omit'] = omitStr
    }
  }

  return await client.sendApiRequest<GetSecretResData, GetSecretError>({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets/${name}`,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { getSecret }
