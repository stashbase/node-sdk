import { LoadEnvironmentOpts, loadEnvironment } from './handlers/load'
import { GetEnvironmentOpts, getEnvironment } from './handlers/get'
import { deleteEnvironmentSecrets } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'
import { ApiError } from '../../http/response'
import { ListSecretsOpts, listSecrets } from './handlers/secrets/list'
import { CreateSecretsData, createSecrets } from './handlers/secrets/create'
import { UpdateSecretsData, updateSecrets } from './handlers/secrets/update'
import { getSecret } from './handlers/secrets/get'

function environmentsAPI(httpClient: HttpClient) {
  // load and inject environment variables
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null }
    }

    return await loadEnvironment(httpClient, options)
  }

  async function get(options?: GetEnvironmentOpts) {
    return await getEnvironment(httpClient, options)
  }

  const secrets = envSecretsAPI(httpClient)

  return {
    load,
    get,
    secrets,
  }
}

function envSecretsAPI(httpClient: HttpClient) {
  /**
   * @summary Retrieve single secret
   * @description Secret
   * @param key Secret key
   * @returns Result object
   * */
  async function get(key: string) {
    if (key?.length < 2) {
      const error: ApiError<'invalid_key'> = { code: 'invalid_key' }
      return { data: null, error }
    }
    return getSecret(httpClient, key)
  }

  /**
   * @summary Retrieve all secrets
   * @description Secrets
   * @param options Options
   * @returns Array of secrets
   * */
  async function list(options?: ListSecretsOpts) {
    return await listSecrets(httpClient, options)
  }

  /**
   * @summary Create secrets
   * @description Secrets
   * @param data Array of secrets
   * @returns createdCount, duplicateKeys
   * */
  async function create(data: CreateSecretsData) {
    if (data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }

    return await createSecrets(httpClient, data)
  }

  /**
   * @summary Update secrets
   * @description Secrets
   * @param data Array of secrets to update
   * @returns updatedCount, notFoundKeys
   * */
  async function update(data: UpdateSecretsData) {
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

    return await updateSecrets(httpClient, data)
  }

  /**
   * @summary Remove secrets
   * @description Secrets
   * @param keys Keys to remove
   * @returns deletedCount, notFound
   * */
  async function remove(keys: string[]) {
    if (keys.length === 0) {
      const error: ApiError<'no_keys'> = { code: 'no_keys' }

      return { data: null, error }
    }

    return await deleteEnvironmentSecrets(httpClient, keys)
  }

  return {
    get,
    list,
    create,
    update,
    remove,
  }
}

export default environmentsAPI
