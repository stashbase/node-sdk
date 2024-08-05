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
   * @summary Get secret
   * @description Secrets
   * @param args project, environment, key
   * @param options Options (return secrets)
   * @returns Secret object
   * */
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
   * @summary List secrets
   * @description Secrets
   * @param args project, environment
   * @param options Options (return secrets);
   * @returns Array of secrets
   * */
  async function list(args: ListSecretsArgs) {
    const { project, environment } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return responseFailure(namesError)
    }

    return await listSecrets(httpClient, args)
  }

  /**
   * @summary Create secrets
   * @description Secrets
   * @param args project, environment, data
   * @returns createdCount, duplicateKeys
   * */
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
   * @summary Set secrets
   * @description Secrets
   * @param args project, environment, data
   * @returns null
   * */
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
   * @summary Update secrets
   * @description Secrets
   * @param args project, environment, data
   * @returns updatedCount, notFoundKeys
   * */
  async function update(args: UpdateSecretsArgs) {
    const { data } = args

    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
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
   * @summary Remove all secrets
   * @description Secrets
   * @param args project, environment
   * @returns deletedCount
   * */
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
