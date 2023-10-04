import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { CreateSecretsArgs, createSecrets } from './handlers/create'
import { DeleteSecretsArgs, deleteSecrets } from './handlers/delete'
import { GetSecretArgs, getSecret } from './handlers/get'
import { ListSecretsArgs, listSecrets } from './handlers/list'
import { UpdateSecretsArgs, updateSecrets } from './handlers/update'

export function secretsAPI(httpClient: HttpClient) {
  /**
   * @summary Get secret
   * @description Secrets
   * @param args project, environment, key
   * @param options Options (return secrets)
   * @returns Secret object
   * */
  async function get(args: GetSecretArgs) {
    return await getSecret(httpClient, args)
  }
  /**
   * @summary List secrets
   * @description Secrets
   * @param args project, environment
   * @param options Options (return secrets);
   * @returns Array of secrets
   * */
  async function list(args: ListSecretsArgs) {
    return await listSecrets(httpClient, args)
  }

  /**
   * @summary Create secrets
   * @description Secrets
   * @param args project, environment, data
   * @returns createdCount, duplicateKeys
   * */
  async function create(args: CreateSecretsArgs) {
    if (args?.data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }

    return await createSecrets(httpClient, args)
  }

  /**
   * @summary Update secrets
   * @description Secrets
   * @param args project, environment, data
   * @returns updatedCount, notFoundKeys
   * */
  async function update(args: UpdateSecretsArgs) {
    const { data } = args

    if (data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }

    // validate
    for (const obj of data) {
      if (obj.newKey === undefined && obj.value === undefined && obj.description === undefined) {
        const error: ApiError<'missing_properties'> = { code: 'missing_properties' }

        return { data: null, error }
      }
    }

    return await updateSecrets(httpClient, args)
  }

  /**
   * @summary Remove secrets
   * @description Secrets
   * @param args project, environment, keys
   * @returns deletedCount, notFound
   * */
  async function remove(args: DeleteSecretsArgs) {
    const { keys } = args

    if (keys.length === 0) {
      const error: ApiError<'no_keys_provided'> = { code: 'no_keys_provided' }

      return { data: null, error }
    }

    return await deleteSecrets(httpClient, args)
  }

  return {
    get,
    list,
    create,
    update,
    remove,
  }
}
