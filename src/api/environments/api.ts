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
  isValidWebhookId,
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
import { listWebhooks } from './handlers/webhooks/list'
import { getWebhook } from './handlers/webhooks/get'
import { listWebhookLogs } from './handlers/webhooks/listLogs'
import { deleteWebhook } from './handlers/webhooks/delete'
import { createWebhook } from './handlers/webhooks/create'
import { CreateWebhookData } from './handlers/webhooks/create'
import { rotateWebhookSigningSecret } from './handlers/webhooks/rotateSecret'
import { getWebhookSigningSecret } from './handlers/webhooks/getSecret'
import { updateWebhookStatus } from './handlers/webhooks/updateStatus'
import { updateWebhook, UpdateWebhookData } from './handlers/webhooks/update'
import { testWebhook } from './handlers/webhooks/test'
import { invalidWebhookIdError } from '../../errors/webhooks'

const validateWebhookIdForMethod = (webhookId: string) => {
  const isValid = isValidWebhookId(webhookId)

  if (!isValid) {
    const error = invalidWebhookIdError
    return responseFailure(error)
  }
}

class EnvironmentsAPI {
  constructor(private httpClient: HttpClient) {}

  /**
   * Loads the environment and injects the secrets into the process.
   *
   * @param options - Options for loading the environment.
   * @returns A promise that resolves to a null, error (if any), and success status.
   */
  async load(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    return await loadEnvironment(this.httpClient, options)
  }

  /**
   * Loads the environment and injects the secrets into the process, throwing an error if it fails.
   *
   * @param options - Options for loading the environment.
   * @returns A promise that resolves to an object containing the loaded data, error (if any), and success status.
   * @throws Error if the loading process fails.
   */
  async loadOrThrow(options?: LoadEnvironmentOpts) {
    if (options?.enabled === false) {
      return { data: null, error: null, ok: null }
    }

    const { error } = await loadEnvironment(this.httpClient, options)

    if (error) {
      throw new Error(error?.code)
    }
  }

  /**
   * Retrieves environment data associated with the current API key.
   *
   * @returns A promise that resolves to the retrieved secret or an error response.
   */
  async get() {
    return await getEnvironment(this.httpClient)
  }

  secrets = new EnvSecretsAPI(this.httpClient)
  webhooks = new WebhooksAPI(this.httpClient)
}

class EnvSecretsAPI {
  constructor(private httpClient: HttpClient) {}

  /**
   * Retrieves a single secret by its key.
   *
   * @param key - The key of the secret to retrieve.
   * @param options - Additional options for retrieving the secret.
   * @returns A promise that resolves to the retrieved secret or an error response.
   */
  async get(key: string, options?: GetSecretOptions) {
    if (!isValidSecretKey(key)) {
      const error = invalidSecretKeyError()
      return responseFailure(error)
    }

    return getSecret(this.httpClient, key, options)
  }

  /**
   * Retrieves all secrets.
   *
   * @param options - Options for listing secrets.
   * @returns A promise that resolves to an array of secrets or an error response.
   */
  async list(options?: ListSecretsOptions) {
    return await listSecrets(this.httpClient, options)
  }

  async listOnly(only: SecretKey[], options?: ListSecretsOptions) {
    if (!Array.isArray(only) || only.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(only)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets(this.httpClient, { ...options, only: only })
  }

  /**
   * Retrieves all secrets excluding the specified keys.
   *
   * @param exclude - An array of secret keys to exclude from the results.
   * @param options - Additional options for listing secrets.
   * @returns A promise that resolves to an array of secrets excluding the specified secrets by their keys or an error response.
   */
  async listExclude(exclude: SecretKey[], options?: ListSecretsOptions) {
    if (!Array.isArray(exclude) || exclude.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(exclude)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await listSecrets(this.httpClient, { ...options, exclude: exclude })
  }

  /**
   * Creates new secrets.
   *
   * @param data - An array of secrets to create.
   * @returns A promise that resolves to an object containing the count of created secrets and any duplicate secrets (keys), or an error response.
   */
  async create(data: CreateSecretsData) {
    const validationError = validateCreateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await createSecrets(this.httpClient, data)
  }

  /**
   * Sets secrets, overwriting existing ones if they exist.
   *
   * @param data - An array of secrets to set.
   * @returns A promise that resolves to null on success or an error response.
   */
  async set(data: SetSecretsData) {
    const validationError = validateSetSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await setSecrets(this.httpClient, data)
  }

  /**
   * Updates existing secrets.
   *
   * @param data - An array of secrets to update.
   * @returns A promise that resolves to an object containing the count of updated secrets and any secrets (keys) not found, or an error response.
   */
  async update(data: UpdateSecretsData) {
    const validationError = validateUpdateSecretsInput(data)

    if (validationError) {
      return responseFailure(validationError)
    }

    return await updateSecrets(this.httpClient, data)
  }

  /**
   * Delete specific secrets.
   *
   * @param keys - An array of secret keys to remove.
   * @returns A promise that resolves to an object containing the count of deleted secrets and any secrets (keys) not found, or an error response.
   */
  async delete(keys: Uppercase<string>[]) {
    if (keys.length === 0) {
      const error = noDataProvidedError()
      return responseFailure(error)
    }

    const { invalidSecretKeys } = validateSecretKeys(keys)

    if (invalidSecretKeys.length > 0) {
      const error = invalidSecretKeysError(invalidSecretKeys)
      return responseFailure(error)
    }

    return await deleteEnvironmentSecrets(this.httpClient, keys)
  }

  /**
   * Delete all secrets from the environment.
   *
   * @returns A promise that resolves to an object containing the count of deleted secrets, or an error response.
   */
  async deleteAll() {
    return await deleteAllEnvironmentSecrets(this.httpClient)
  }
}

class WebhooksAPI {
  constructor(private httpClient: HttpClient) {}

  /** Retrieves a list of webhooks associated with the current API key environment. */
  async list() {
    return await listWebhooks(this.httpClient)
  }

  /** Retrieves a single webhook associated with the current API key environment. */
  async get(webhookId: string, withSecret?: boolean) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await getWebhook(this.httpClient, { webhookId, withSecret: withSecret ?? false })
  }

  async listLogs(
    webhookId: string,
    options?: {
      /** The current page number (min 1, max 1000, default 1). */
      page?: number
      /** The number of items per page (min 2, max 30, default 10). */
      limit?: number
    }
  ) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    const opts = options ?? {}
    return await listWebhookLogs(this.httpClient, { webhookId, ...opts })
  }

  async create(data: CreateWebhookData) {
    return await createWebhook(this.httpClient, data)
  }

  async enable(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await updateWebhookStatus(this.httpClient, webhookId, true)
  }

  async disable(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await updateWebhookStatus(this.httpClient, webhookId, false)
  }

  async update(webhookId: string, data: UpdateWebhookData) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await updateWebhook(this.httpClient, { webhookId, data })
  }

  async test(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await testWebhook(this.httpClient, webhookId)
  }

  async delete(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await deleteWebhook(this.httpClient, webhookId)
  }

  async getSigningSecret(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await getWebhookSigningSecret(this.httpClient, webhookId)
  }

  async rotateSigningSecret(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await rotateWebhookSigningSecret(this.httpClient, webhookId)
  }
}

export default EnvironmentsAPI
