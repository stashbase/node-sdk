import { HttpClient } from '../../../http/client'
import { ApiError } from '../../../http/response'
import { isValidSecretKey } from '../../../utils/inputValidation'
import { checkValidProjectEnv } from '../environments/api'
import { CreateSecretsArgs, createSecrets } from './handlers/create'
import { DeleteSecretsArgs, deleteSecrets } from './handlers/delete'
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
      return { data: null, error: namesError }
    }

    if (!isValidSecretKey(key)) {
      const error: ApiError<'invalid_secret_key_format'> = { code: 'invalid_secret_key_format' }

      return { data: null, error }
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
      return { data: null, error: namesError }
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

    if (data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }
    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return { data: null, error: namesError }
    }

    const invalidKey = data.find(({ key }) => !isValidSecretKey(key))

    if (invalidKey) {
      const error: ApiError<'invalid_secret_key_format'> = { code: 'invalid_secret_key_format' }

      return { data: null, error }
    }

    const duplicateKey = data?.some((d, i) =>
      data?.some((d2, j) => d.key === d2.key && d.key !== undefined && i !== j)
    )

    if (duplicateKey) {
      const error: ApiError<'duplicate_keys'> = { code: 'duplicate_keys' }
      return { data: null, error }
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
    const { project, environment } = args

    if (args?.data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }
    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return { data: null, error: namesError }
    }

    const invalidKey = args.data.find(({ key }) => !isValidSecretKey(key))

    if (invalidKey) {
      const error: ApiError<'invalid_secret_key_format'> = { code: 'invalid_secret_key_format' }

      return { data: null, error }
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

    if (data?.length === 0) {
      const error: ApiError<'no_values_provided'> = { code: 'no_values_provided' }

      return { data: null, error }
    }

    // validate
    for (const [index, { key, newKey, value, description }] of data.entries()) {
      if (!isValidSecretKey(key)) {
        const error: ApiError<'invalid_secret_key_format'> = { code: 'invalid_secret_key_format' }
        return { data: null, error }
      }

      if (newKey !== undefined) {
        if (!isValidSecretKey(newKey)) {
          const error: ApiError<'invalid_new_key'> = { code: 'invalid_new_key' }
          return { data: null, error }
        }
      }

      if (newKey === undefined && value === undefined && description === undefined) {
        const error: ApiError<'missing_properties'> = { code: 'missing_properties' }

        return { data: null, error }
      }

      const duplicateKey = data.some((d, i) => i !== index && d.key === key && key !== undefined)

      if (duplicateKey) {
        const error: ApiError<'duplicate_keys'> = { code: 'duplicate_keys' }
        return { data: null, error }
      }

      const duplicateNewKey = data.some(
        (d, i) => i !== index && d.newKey === newKey && newKey !== undefined
      )

      if (duplicateNewKey) {
        const error: ApiError<'duplicate_new_keys'> = { code: 'duplicate_new_keys' }
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
    const { keys, project, environment } = args

    const namesError = checkValidProjectEnv(project, environment)

    if (namesError) {
      return { data: null, error: namesError }
    }

    if (keys.length === 0) {
      const error: ApiError<'no_keys_provided'> = { code: 'no_keys_provided' }

      return { data: null, error }
    }

    const invalidKey = keys.find((key) => !isValidSecretKey(key))

    if (invalidKey) {
      const error: ApiError<'invalid_secret_key_format'> = { code: 'invalid_secret_key_format' }

      return { data: null, error }
    }

    return await deleteSecrets(httpClient, args)
  }

  return {
    get,
    list,
    create,
    set,
    update,
    remove,
  }
}
