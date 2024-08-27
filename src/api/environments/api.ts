import { loadEnvironment } from './handlers/load'
import { getEnvironment } from './handlers/get'
import { deleteEnvironmentSecrets } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'
import { listSecrets } from './handlers/secrets/list'
import { CreateSecretsData, createSecrets } from './handlers/secrets/create'
import { UpdateSecretsData, updateSecrets } from './handlers/secrets/update'
import { getSecret } from './handlers/secrets/get'
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
import { GetSecretOptions, ListSecretsOptions } from '../../types/secrets'
import { SecretKey } from '../../types/secretKey'

function environmentsAPI(httpClient: HttpClient) {
  /**
   * Loads the environment and injects the secrets into the process.
   *
   * @param options - Options for loading the environment.
   * @returns A promise that resolves to a null, error (if any), and success status.
   */
  async function load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    return await loadEnvironment(httpClient, options)
  }

  /**
   * Loads the environment and injects the secrets into the process, throwing an error if it fails.
   *
   * @param options - Options for loading the environment.
   * @returns A promise that resolves to an object containing the loaded data, error (if any), and success status.
   * @throws Error if the loading process fails.
   */
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
   * Retrieves environment data associated with the current API key.
   *
   * @returns A promise that resolves to the retrieved secret or an error response.
   */
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
   * Retrieves a single secret by its key.
   *
   * @param key - The key of the secret to retrieve.
   * @param options - Additional options for retrieving the secret.
   * @returns A promise that resolves to the retrieved secret or an error response.
   */
  async function get(key: string, options?: GetSecretOptions) {
    if (!isValidSecretKey(key)) {
      const error = invalidSecretKeyError()
      return responseFailure(error)
    }
    return getSecret(httpClient, key, options)
  }

  /**
   * Retrieves all secrets.
   *
   * @param options - Options for listing secrets.
   * @returns A promise that resolves to an array of secrets or an error response.
   */
  async function list(options?: ListSecretsOptions) {
    return await listSecrets(httpClient, options)
  }

  async function listOnly(keys: SecretKey[], options?: ListSecretsOptions) {
    if (!Array.isArray(keys) || keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets(httpClient, { ...options, only: keys })
  }

  /**
   * Retrieves all secrets excluding the specified keys.
   *
   * @param excludeKeys - An array of secret keys to exclude from the results.
   * @param options - Additional options for listing secrets.
   * @returns A promise that resolves to an array of secrets excluding the specified secrets by their keys or an error response.
   */
  async function listExclude(excludeKeys: SecretKey[], options?: ListSecretsOptions) {
    if (!Array.isArray(excludeKeys) || excludeKeys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(excludeKeys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets(httpClient, { ...options, exclude: excludeKeys })
  }

  /**
   * Creates new secrets.
   *
   * @param data - An array of secrets to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate secrets (keys), or an error response.
   */
  async function create(data: CreateSecretsData) {
    const validationError = validateCreateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(httpClient, data)
  }

  /**
   * Sets secrets, overwriting existing ones if they exist.
   *
   * @param data - An array of secrets to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async function set(data: SetSecretsData) {
    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(httpClient, data)
  }

  /**
   * Updates existing secrets.
   *
   * @param data - An array of secrets to update.
   * @returns A promise that resolves to an object containing the count of updated secrets and any secrets (keys) not found, or an error response.
   */
  async function update(data: UpdateSecretsData) {
    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets(httpClient, data)
  }

  /**
   * Removes specific secrets.
   *
   * @param keys - An array of secret keys to remove.
   * @returns A promise that resolves to an object containing the count of deleted secrets and any secrets (keys) not found, or an error response.
   */
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
   * Removes all secrets from the environment.
   *
   * @returns A promise that resolves to an object containing the count of deleted secrets, or an error response.
   */
  async function removeAll() {
    return await deleteAllEnvironmentSecrets(httpClient)
  }

  return {
    get,
    list,
    listOnly,
    listExclude,
    create,
    set,
    update,
    remove,
    removeAll,
  }
}

export default environmentsAPI
