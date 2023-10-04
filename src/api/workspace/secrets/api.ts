import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { CreateSecretsArgs, createSecrets } from './handlers/create'
import { GetSecretArgs, getSecret } from './handlers/get'
import { ListSecretsArgs, listSecrets } from './handlers/list'

export function secretsAPI(httpClient: HttpClient) {
  /**
   * @summary Get secret
   * @description Secrets
   * @param args project, environment name, key
   * @param options Options (return secrets)
   * @returns Secret object
   * */
  async function get(args: GetSecretArgs) {
    return await getSecret(httpClient, args)
  }
  /**
   * @summary List secrets
   * @description Secrets
   * @param args project, environment name
   * @param options Options (return secrets);
   * @returns Array of secrets
   * */
  async function list(args: ListSecretsArgs) {
    return await listSecrets(httpClient, args)
  }

  /**
   * @summary Create secrets
   * @description Secrets
   * @param args project, environment name, data
   * @returns createdCount, duplicateKeys
   * */
  async function create(args: CreateSecretsArgs) {
    if (args?.data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }

    return await createSecrets(httpClient, args)
  }

  return {
    get,
    list,
    create,
  }
}
