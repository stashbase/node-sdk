import { invalidEnvironmentIdentifierError, invalidProjectIdentifierError } from '../../../errors'
import {
  invalidSecretKeyError,
  invalidSecretKeysError,
  noDataProvidedError,
} from '../../../errors/secrets'
import { HttpClient } from '../../../http/client'
import { responseFailure } from '../../../http/response'
import { SecretKey } from '../../../types/secretKey'
import {
  CreateSecretsItem,
  GetSecretOptions,
  ListSecretsOptions,
  SetSecretsItem,
  UpdateSecretsItem,
} from '../../../types/secrets'
import {
  isValidEnvironmentIdentifier,
  isValidProjectIdentifier,
  isValidSecretKey,
  validateCreateSecretsInput,
  validateSecretKeys,
  validateSetSecretsInput,
  validateUpdateSecretsInput,
} from '../../../utils/inputValidation'
import { createSecrets } from './handlers/create'
import { deleteSecrets } from './handlers/delete'
import { deleteAllSecrets } from './handlers/deleteAll'
import { getSecret } from './handlers/get'
import { listSecrets } from './handlers/list'
import { setSecrets } from './handlers/set'
import { updateSecrets } from './handlers/update'

export class SecretsAPI {
  private httpClient: HttpClient
  public project: string
  public environment: string

  public constructor(httpClient: HttpClient, project: string, environment: string) {
    this.httpClient = httpClient
    this.project = project
    this.environment = environment
  }

  private getHandlerArgs() {
    return { client: this.httpClient, project: this.project, environment: this.environment }
  }

  private validateIdentifiers(secretKey?: string) {
    const { project, environment } = this

    if (!isValidProjectIdentifier(project)) {
      const error = invalidProjectIdentifierError
      return error
    }

    if (!isValidEnvironmentIdentifier(environment)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }

    if (secretKey !== undefined && !isValidSecretKey(secretKey)) {
      const error = invalidSecretKeyError()
      return error
    }
  }

  /**
   * Retrieves a single secret by its key from a specific project and environment.
   *
   * @param key - The key of the secret to retrieve.
   * @param options - Optional parameters for retrieving the secret.
   * @returns A promise that resolves to the secret object or an error response.
   */
  async get(key: SecretKey, options?: GetSecretOptions) {
    const validationError = this.validateIdentifiers(key)
    if (validationError) return responseFailure(validationError)

    return await getSecret({ key, ...(options ?? {}), ...this.getHandlerArgs() })
  }

  /**
   * Lists all secrets for a specific project and environment.
   *
   * @param options - Optional parameters for listing secrets.
   * @returns A promise that resolves to an array of secret objects or an error response.
   */
  async list(options?: ListSecretsOptions) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    return await listSecrets({ ...this.getHandlerArgs(), options })
  }

  /**
   * Lists specific secrets for a project and environment.
   *
   * @param only - An array of secret keys to retrieve.
   * @param options - Optional parameters for listing secrets.
   * @returns A promise that resolves to an array of specified secret objects or an error response.
   */
  async listOnly(only: SecretKey[], options?: ListSecretsOptions) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    if (!Array.isArray(only) || only.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(only)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets({ ...this.getHandlerArgs(), only, options })
  }

  /**
   * Lists secrets for a project and environment, excluding secrets with specified keys.
   *
   * @param exclude - An array of secret keys to exclude from the response.
   * @param options - Optional parameters for listing secrets.
   * @returns A promise that resolves to an array of secret objects (excluding specified keys) or an error response.
   */
  async listExclude(exclude: SecretKey[], options?: ListSecretsOptions) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    if (!Array.isArray(exclude) || exclude.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(exclude)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets({ ...this.getHandlerArgs(), exclude, options })
  }

  /**
   * Creates new secrets in a specific project and environment.
   *
   * @param data - The secret data to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate keys, or an error response.
   */
  async create(data: Array<CreateSecretsItem>) {
    const validationError = validateCreateSecretsInput(data)
    if (validationError) return responseFailure(validationError)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets({ ...this.getHandlerArgs(), data })
  }

  /**
   * Sets secrets in a specific project and environment, overwriting existing ones with the same keys.
   *
   * @param data - The secret data to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async set(data: Array<SetSecretsItem>) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets({ ...this.getHandlerArgs(), data })
  }

  /**
   * Updates existing secrets in a specific project and environment.
   *
   * @param data - The secret data to update.
   * @returns A promise that resolves to an object containing the count of updated secrets and any keys not found, or an error response.
   */
  async update(data: Array<UpdateSecretsItem>) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets({ ...this.getHandlerArgs(), data })
  }

  /**
   * Deletes specific secrets from a project and environment.
   *
   * @param keys - An array of secret keys to remove.
   * @returns A promise that resolves to an object containing the count of deleted secrets and any keys not found, or an error response.
   */
  async delete(keys: SecretKey[]) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    if (keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await deleteSecrets({ ...this.getHandlerArgs(), keys })
  }

  /**
   * Deletes all secrets from a specific project and environment.
   *
   * @returns A promise that resolves to an object containing the count of deleted secrets, or an error response.
   */
  async deleteAll() {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    return await deleteAllSecrets(this.getHandlerArgs())
  }
}
