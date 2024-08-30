import { loadEnvironment } from './handlers/load'
import { getEnvironment } from './handlers/get'
import { deleteEnvironmentSecrets } from './handlers/secrets/delete'
import { HttpClient } from '../../http/client'
import { listSecrets } from './handlers/secrets/list'
import { CreateSecretsData, createSecrets } from './handlers/secrets/create'
import { UpdateSecretsData, updateSecrets } from './handlers/secrets/update'
import { getSecret } from './handlers/secrets/get'
import {
  isValidHttpsUrl,
  isValidSecretKey,
  isValidWebhookDescription,
  validateCreateSecretsInput,
  validateSecretKeys,
  validateSetSecretsInput,
  validateUpdateSecretsInput,
  validateWebhookIdForMethod,
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
import { rotateWebhookSigningSecret } from './handlers/webhooks/rotateSecret'
import { getWebhookSigningSecret } from './handlers/webhooks/getSecret'
import { updateWebhookStatus } from './handlers/webhooks/updateStatus'
import { updateWebhook } from './handlers/webhooks/update'
import { testWebhook } from './handlers/webhooks/test'
import {
  invalidWebhookDescriptionError,
  invalidWebhookLogsLimitError,
  invalidWebhookLogsPageError,
  invalidWebhookUrlError,
  webhookMissingPropertiesToUpdateError,
} from '../../errors/webhooks'
import { CreateWebhookData, UpdateWebhookData } from '../../types/webhooks'

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

  /**
   * Retrieves a list of webhooks associated with the current API key environment.
   *
   * @returns A promise that resolves to an array of webhooks or an error response.
   */
  async list() {
    return await listWebhooks(this.httpClient)
  }

  /**
   * Retrieves a single webhook associated with the current API key environment.
   *
   * @param webhookId - The ID of the webhook to retrieve.
   * @param withSecret - Whether to include the signing secret in the response.
   * @returns A promise that resolves to the retrieved webhook or an error response.
   */
  async get(webhookId: string, withSecret?: boolean) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await getWebhook(this.httpClient, { webhookId, withSecret: withSecret ?? false })
  }

  /**
   * Retrieves a list of logs for a specific webhooka.
   *
   * @param webhookId - The ID of the webhook to retrieve logs for.
   * @param options - Options for listing logs.
   * @returns A promise that resolves to an array of logs or an error response.
   */
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

    if (options?.page !== undefined) {
      const page = options.page

      if (page <= 0 || page > 1000 || typeof page !== 'number') {
        const error = invalidWebhookLogsPageError
        return responseFailure(error)
      }
    }

    if (options?.limit !== undefined) {
      const limit = options.limit

      if (limit < 2 || limit > 30 || typeof limit !== 'number') {
        const error = invalidWebhookLogsLimitError
        return responseFailure(error)
      }
    }

    const opts = options ?? {}
    return await listWebhookLogs(this.httpClient, { webhookId, ...opts })
  }

  /**
   * Creates a new webhook.
   *
   * @param data - Data for creating the webhook.
   * @returns A promise that resolves to the created webhook or an error response.
   */
  async create(data: CreateWebhookData) {
    const isValidUrl = isValidHttpsUrl(data.url)

    if (!isValidUrl) {
      const error = invalidWebhookUrlError
      return responseFailure(error)
    }

    if (data.description) {
      const isValidDescription = isValidWebhookDescription(data.description)

      if (!isValidDescription) {
        const error = invalidWebhookDescriptionError
        return responseFailure(error)
      }
    }

    return await createWebhook(this.httpClient, data)
  }

  /**
   * Enables a webhook.
   *
   * @param webhookId - The ID of the webhook to enable.
   * @returns A promise that resolves to null on success or an error response.
   */
  async enable(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await updateWebhookStatus(this.httpClient, webhookId, true)
  }

  /**
   * Disables a webhook.
   *
   * @param webhookId - The ID of the webhook to disable.
   * @returns A promise that resolves to null on success or an error response.
   */
  async disable(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await updateWebhookStatus(this.httpClient, webhookId, false)
  }

  /**
   * Updates an existing webhook.
   *
   * @param webhookId - The ID of the webhook to update.
   * @param data - Data for updating the webhook.
   * @returns A promise that resolves to null on success or an error response.
   */
  async update(webhookId: string, data: UpdateWebhookData) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    if (data.url === undefined && data.description === undefined) {
      const error = webhookMissingPropertiesToUpdateError
      return responseFailure(error)
    }

    if (data.url !== undefined) {
      const isValidUrl = isValidHttpsUrl(data.url)

      if (!isValidUrl) {
        const error = invalidWebhookUrlError
        return responseFailure(error)
      }
    }

    if (data.description) {
      const isValidDescription = isValidWebhookDescription(data.description)

      if (!isValidDescription) {
        const error = invalidWebhookDescriptionError
        return responseFailure(error)
      }
    }

    return await updateWebhook(this.httpClient, { webhookId, data })
  }

  /**
   * Tests a webhook by sending a test payload.
   *
   * @param webhookId - The ID of the webhook to test.
   * @returns A promise that resolves to result object on success or an error response.
   */
  async test(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await testWebhook(this.httpClient, webhookId)
  }

  /**
   * Deletes a webhook.
   *
   * @param webhookId - The ID of the webhook to delete.
   * @returns A promise that resolves to null on success or an error response.
   */
  async delete(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await deleteWebhook(this.httpClient, webhookId)
  }

  /**
   * Retrieves the signing secret for a webhook.
   *
   * @param webhookId - The ID of the webhook to retrieve the signing secret for.
   * @returns A promise that resolves to the signing secret or an error response.
   */
  async getSigningSecret(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await getWebhookSigningSecret(this.httpClient, webhookId)
  }

  /**
   * Rotates the signing secret for a webhook.
   *
   * @param webhookId - The ID of the webhook to rotate the signing secret for.
   * @returns A promise that resolves to the new signing secret or an error response.
   */
  async rotateSigningSecret(webhookId: string) {
    const invalidWebhookIdError = validateWebhookIdForMethod(webhookId)

    if (invalidWebhookIdError) {
      return invalidWebhookIdError
    }

    return await rotateWebhookSigningSecret(this.httpClient, webhookId)
  }
}

export default EnvironmentsAPI
