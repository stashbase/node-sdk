import { ApiResponse } from '../../../../http/response'
import {
  GetSecretOptions,
  GetSecretQueryParams,
  Secret,
  SecretName,
} from '../../../../types/secrets'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { GetSecretErrorCode as SharedGetSecretsErrorCode } from '../../../../types/errors/secrets'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'

type GetSecretErrorCode = SharedGetSecretsErrorCode | EnvironmentContextErrorCode
type GetSecretResponse = Promise<ApiResponse<Secret, GetSecretErrorCode>>

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
      query.expand_refs = true
    }
  }

  if (omit && omit.length > 0) {
    const omitStr = omit.filter((o) => o === 'value' || o === 'comment').join(',')

    if (omitStr.length > 0) {
      query.omit = omitStr
    }
  }

  return await client.sendApiRequest<Secret, GetSecretErrorCode>({
    method: 'GET',
    path: `/v1/projects/${project}/environments/${environment}/secrets/${name}`,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { getSecret }
