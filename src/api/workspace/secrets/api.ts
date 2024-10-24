import { invalidEnvironmentIdentifierError, invalidProjectIdentifierError } from '../../../errors'
import {
  invalidSecretNameError,
  invalidSecretNamesError,
  noDataProvidedError,
} from '../../../errors/secrets'
import { HttpClient } from '../../../http/client'
import { responseFailure } from '../../../http/response'
import {
  SecretName,
  CreateSecretsItem,
  GetSecretOptions,
  ListSecretsOptions,
  SetSecretsItem,
  UpdateSecretsItem,
} from '../../../types/secrets'
import {
  isValidEnvironmentIdentifier,
  isValidProjectIdentifier,
  isValidSecretName,
  validateCreateSecretsInput,
  validateSecretNames,
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

  private validateIdentifiers(secretName?: string) {
    const { project, environment } = this

    if (!isValidProjectIdentifier(project)) {
      const error = invalidProjectIdentifierError
      return error
    }

    if (!isValidEnvironmentIdentifier(environment)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }

    if (secretName !== undefined && !isValidSecretName(secretName)) {
      const error = invalidSecretNameError()
      return error
    }
  }

  /**
   * Retrieves a single secret by its name from a specific project and environment.
   *
   * @param name - The name of the secret to retrieve.
   * @param options - Optional parameters for retrieving the secret.
   * @returns A promise that resolves to the secret object or an error response.
   */
  async get(name: SecretName, options?: GetSecretOptions) {
    const validationError = this.validateIdentifiers(name)
    if (validationError) return responseFailure(validationError)

    return await getSecret({ name, options, ...this.getHandlerArgs() })
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
   * @param only - An array of secret names to retrieve.
   * @param options - Optional parameters for listing secrets.
   * @returns A promise that resolves to an array of specified secret objects or an error response.
   */
  async listOnly(only: SecretName[], options?: ListSecretsOptions) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    if (!Array.isArray(only) || only.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretNames } = validateSecretNames(only)

    if (invalidSecretNames.length > 0) {
      const error = invalidSecretNamesError(invalidSecretNames)
      return responseFailure(error)
    }

    return await listSecrets({ ...this.getHandlerArgs(), only, options })
  }

  /**
   * Lists secrets for a project and environment, excluding secrets with specified names.
   *
   * @param exclude - An array of secret names to exclude from the response.
   * @param options - Optional parameters for listing secrets.
   * @returns A promise that resolves to an array of secret objects (excluding specified names) or an error response.
   */
  async listExclude(exclude: SecretName[], options?: ListSecretsOptions) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    if (!Array.isArray(exclude) || exclude.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretNames } = validateSecretNames(exclude)

    if (invalidSecretNames.length > 0) {
      const error = invalidSecretNamesError(invalidSecretNames)
      return responseFailure(error)
    }

    return await listSecrets({ ...this.getHandlerArgs(), exclude, options })
  }

  /**
   * Creates new secrets in a specific project and environment.
   *
   * @param data - The secret data to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate names, or an error response.
   */
  async create(data: CreateSecretsItem[]) {
    const validationError = validateCreateSecretsInput(data)
    if (validationError) return responseFailure(validationError)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets({ ...this.getHandlerArgs(), data })
  }

  /**
   * Sets secrets in a specific project and environment, overwriting existing ones with the same names.
   *
   * @param data - The secret data to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async set(data: SetSecretsItem[]) {
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
   * @returns A promise that resolves to an object containing the count of updated secrets and any names not found, or an error response.
   */
  async update(data: UpdateSecretsItem[]) {
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
   * @param names - An array of secret names to remove.
   * @returns A promise that resolves to an object containing the count of deleted secrets and any names not found, or an error response.
   */
  async delete(names: SecretName[]) {
    const identifierValidationError = this.validateIdentifiers()
    if (identifierValidationError) return responseFailure(identifierValidationError)

    if (names.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretNames } = validateSecretNames(names)

    if (invalidSecretNames.length > 0) {
      const error = invalidSecretNamesError(invalidSecretNames)
      return responseFailure(error)
    }

    return await deleteSecrets({ ...this.getHandlerArgs(), names })
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
