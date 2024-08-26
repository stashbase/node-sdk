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
import { AtLeastOne } from '../../types/util'

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
    return await listSecrets({ envClient: httpClient, options })
  }

  async function listOnly(keys: SecretKey[], options?: ListSecretsOptions) {
    if (keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets({ envClient: httpClient, options, only: keys })
  }

  async function listExcluding(excludeKeys: SecretKey[], options?: ListSecretsOptions) {
    if (excludeKeys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(excludeKeys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets({ envClient: httpClient, options, exclude: excludeKeys })
  }

  /**
   * Creates a new secret.
   *
   * @param key - The key of the secret to create.
   * @param value - The value of the secret.
   * @param description - Optional description for the secret.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate secrets (keys), or an error response.
   */
  async function create(key: SecretKey, value: string, description?: string | null) {
    const validationError = validateCreateSecretsInput([
      {
        key,
        value,
        description,
      },
    ])

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(httpClient, [{ key, value, description }])
  }

  /**
   * Creates new secrets.
   *
   * @param data - An array of secrets to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate secrets (keys), or an error response.
   */
  async function createMany(data: CreateSecretsData) {
    const validationError = validateCreateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(httpClient, data)
  }

  /**
   * Sets a single secret, overwriting it if it already exists.
   *
   * @param key - The key of the secret to set.
   * @param value - The value of the secret.
   * @param description - Optional description for the secret.
   * @returns A promise that resolves to an object containing the count of set secrets and any secrets (keys) not found, or an error response.
   */
  async function set(key: SecretKey, value: string, description?: string | null) {
    const arrayItems = [{ key, value, description }]

    const validationError = validateSetSecretsInput(arrayItems)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(httpClient, arrayItems)
  }

  /**
   * Sets secrets, overwriting existing ones if they exist.
   *
   * @param data - An array of secrets to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async function setMany(data: SetSecretsData) {
    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(httpClient, data)
  }

  /**
   * Updates a single secret.
   *
   * @param key - The key of the secret to update.
   * @param data - An object containing at least one of the following properties:
   *               newKey - The new key for the secret (optional).
   *               value - The new value for the secret (optional).
   *               description - The new description for the secret (optional).
   * @returns A promise that resolves to an object containing the count of updated secrets and any secrets (keys) not found, or an error response.
   */
  async function update(
    key: SecretKey,
    data: AtLeastOne<{
      newKey: SecretKey
      value: string
      description: string | null
    }>
  ) {
    const arrayItems = [{ key, ...data }]
    const validationError = validateUpdateSecretsInput(arrayItems)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets(httpClient, arrayItems)
  }

  /**
   * Updates existing secrets.
   *
   * @param data - An array of secrets to update.
   * @returns A promise that resolves to an object containing the count of updated secrets and any secrets (keys) not found, or an error response.
   */
  async function updateMany(data: UpdateSecretsData) {
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
  async function removeMany(keys: Uppercase<string>[]) {
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
    listExcluding,
    create,
    createMany,
    set,
    setMany,
    update,
    updateMany,
    removeMany,
    removeAll,
  }
}

export default environmentsAPI
