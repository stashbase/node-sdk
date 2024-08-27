import {
  invalidSecretKeyError,
  invalidSecretKeysError,
  noDataProvidedError,
} from '../../../errors/secrets'
import { HttpClient } from '../../../http/client'
import { responseFailure } from '../../../http/response'
import {
  isValidSecretKey,
  validateCreateSecretsInput,
  validateSecretKeys,
  validateSetSecretsInput,
  validateUpdateSecretsInput,
} from '../../../utils/inputValidation'
import { checkValidProjectEnv } from '../environments/api'
import { CreateSecretsArgs, createSecrets } from './handlers/create'
import { DeleteSecretsArgs, deleteSecrets } from './handlers/delete'
import { DeleteAllSecretsArgs, deleteAllSecrets } from './handlers/deleteAll'
import { GetSecretArgs, getSecret } from './handlers/get'
import { ListSecretsArgs, listSecrets } from './handlers/list'
import { SetSecretsArgs, setSecrets } from './handlers/set'
import { UpdateSecretsArgs, updateSecrets } from './handlers/update'

export function secretsAPI(httpClient: HttpClient) {
  /**
   * Retrieves a single secret by its key from a specific project and environment.
   *
   * @param args - The arguments for retrieving a secret.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.key - The key of the secret to retrieve.
   * @returns A promise that resolves to the secret object or an error response.
   */
  async function get(args: GetSecretArgs) {
    const { project, environment, key } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    if (!isValidSecretKey(key)) {
      const error = invalidSecretKeyError()
      return responseFailure(error)
    }

    return await getSecret(httpClient, args)
  }

  /**
   * Lists all secrets for a specific project and environment.
   *
   * @param args - The arguments for listing secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @returns A promise that resolves to an array of secret objects or an error response.
   */
  async function list(args: ListSecretsArgs) {
    const { project, environment } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    return await listSecrets(httpClient, args)
  }

  /**
   * Creates new secrets in a specific project and environment.
   *
   * @param args - The arguments for creating secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.data - The secret data to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate keys, or an error response.
   */
  async function create(args: CreateSecretsArgs) {
    const { project, environment, data } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    const validationError = validateCreateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(httpClient, args)
  }

  /**
   * Sets secrets in a specific project and environment, overwriting existing ones with the same keys.
   *
   * @param args - The arguments for setting secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.data - The secret data to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async function set(args: SetSecretsArgs) {
    const { project, environment, data } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(httpClient, args)
  }

  /**
   * Updates existing secrets in a specific project and environment.
   *
   * @param args - The arguments for updating secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.data - The secret data to update.
   * @returns A promise that resolves to an object containing the count of updated secrets and any keys not found, or an error response.
   */
  async function update(args: UpdateSecretsArgs) {
    const { data } = args

    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets(httpClient, args)
  }

  /**
   * Removes specific secrets from a project and environment.
   *
   * @param args - The arguments for removing secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.keys - An array of secret keys to remove.
   * @returns A promise that resolves to an object containing the count of deleted secrets and any keys not found, or an error response.
   */
  async function remove(args: DeleteSecretsArgs) {
    const { keys, project, environment } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    if (keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await deleteSecrets(httpClient, args)
  }

  /**
   * Removes all secrets from a specific project and environment.
   *
   * @param args - The arguments for removing all secrets.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @returns A promise that resolves to an object containing the count of deleted secrets, or an error response.
   */
  async function removeAll(args: DeleteAllSecretsArgs) {
    const { project, environment } = args
    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    return await deleteAllSecrets(httpClient, args)
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
