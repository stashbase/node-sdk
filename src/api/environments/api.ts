import { loadEnvironment } from './handlers/load'
import { getEnvironment } from './handlers/get'
import { deleteEnvironmentSecrets } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'
import { ListSecretsOpts, listSecrets } from './handlers/secrets/list'
import { CreateSecretsData, createSecrets } from './handlers/secrets/create'
import { UpdateSecretsData, updateSecrets } from './handlers/secrets/update'
import { getSecret, GetSecretOptions } from './handlers/secrets/get'
import {
  isValidSecretKey,
  validateCreateSecretsInput,
  validateSecretKeys,
  validateSetSecretsInput,
  validateUpdateSecretsInput,
} from '../../utils/inputValidation'
import { SetSecretsData, setSecrets } from './handlers/secrets/set'
import {
  invalidSecretKeyError,
  invalidSecretKeysError,
  noDataProvidedError,
} from '../../errors/secrets'
import { responseFailure } from '../../http/response'
import { LoadEnvironmentOpts } from '../../types/environments'
import { deleteAllEnvironmentSecrets } from './handlers/secrets/deleteAll'

function environmentsAPI(httpClient: HttpClient) {
  /**
   * @summary Load environment
   * @description Load environment and inject the secrets to the process
   * @param key options print keys or key-values table with the secrets
   * @returns null
   * */
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    return await loadEnvironment(httpClient, options)
  }

  /**
   * @summary Load environment
   * @description Load environment and inject the secrets to the process, throws an error if it fails
   * @param key options print keys or key-values table with the secrets
   * @returns null
   * */
  async function loadOrThrow(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const { error } = await loadEnvironment(httpClient, options)

    if (error) {
      throw new Error(error?.code)
    }
  }

  /**
   * @summary Get environment
   * @description Environment
   * @returns Environment data
   * */
  async function get() {
    return await getEnvironment(httpClient)
  }

  const secrets = envSecretsAPI(httpClient)

  return {
    load,
    loadOrThrow,
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
  async function get(key: string, options?: GetSecretOptions) {
    if (!isValidSecretKey(key)) {
      const error = invalidSecretKeyError()
      return responseFailure(error)
    }
    return getSecret(httpClient, key, options)
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
    const validationError = validateCreateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(httpClient, data)
  }

  /**
   * @summary Set secrets
   * @description Secrets
   * @param data Array of secrets
   * @returns null
   * */
  async function set(data: SetSecretsData) {
    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(httpClient, data)
  }

  /**
   * @summary Update secrets
   * @description Secrets
   * @param data Array of secrets to update
   * @returns updatedCount, notFoundKeys
   * */
  async function update(data: UpdateSecretsData) {
    // if (data?.length === 0) {
    //   const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }
    //
    //   return { data: null, error }
    // }
    //
    // // validate
    // for (const [index, { key, newKey, value, description }] of data.entries()) {
    //   if (!isValidSecretKey(key)) {
    //     const error: ApiError<'invalid_secret_key'> = { code: 'invalid_secret_key' }
    //     return { data: null, error }
    //   }
    //
    //   if (newKey !== undefined) {
    //     if (!isValidSecretKey(newKey)) {
    //       const error: ApiError<'invalid_new_key'> = { code: 'invalid_new_key' }
    //       return { data: null, error }
    //     }
    //   }
    //
    //   if (newKey === undefined && value === undefined && description === undefined) {
    //     const error: ApiError<'missing_properties'> = { code: 'missing_properties' }
    //
    //     return { data: null, error }
    //   }
    //
    //   const duplicateNewKey = data.some(
    //     (d, i) => i !== index && d.newKey === newKey && d?.newKey !== undefined
    //   )
    //
    //   if (duplicateNewKey) {
    //     const error: ApiError<'duplicate_new_keys'> = { code: 'duplicate_new_keys' }
    //     return { data: null, error }
    //   }
    // }

    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets(httpClient, data)
  }

  /**
   * @summary Remove secrets
   * @description Secrets
   * @param keys Keys to remove
   * @returns deletedCount, notFound
   * */
  async function remove(keys: Uppercase<string>[]) {
    if (keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await deleteEnvironmentSecrets(httpClient, keys)
  }

  /**
   * @summary Remove ll secrets
   * @description Secrets
   * @returns deletedCount
   * */
  async function removeAll() {
    return await deleteAllEnvironmentSecrets(httpClient)
  }

  return {
    get,
    list,
    create,
    set,
    update,
    remove,
    removeAll,
  }
}

export default environmentsAPI
