import { invalidEnvironmentIdentifierError, invalidProjectIdentifierError } from '../../../errors'
import {
  invalidWebhookDescriptionError,
  invalidWebhookIdError,
  invalidWebhookLogsLimitError,
  invalidWebhookLogsPageError,
  invalidWebhookUrlError,
  webhookMissingPropertiesToUpdateError,
} from '../../../errors/webhooks'
import { HttpClient } from '../../../http/client'
import { responseFailure } from '../../../http/response'
import { CreateWebhookData, UpdateWebhookData } from '../../../types/webhooks'
import {
  isValidHttpsUrl,
  isValidProjectIdentifier,
  isValidWebhookDescription,
  isValidWebhookId,
} from '../../../utils/inputValidation'
import { createWebhook } from './handlers/create'
import { deleteWebhook } from './handlers/delete'
import { getWebhook } from './handlers/get'
import { getWebhookSigningSecret } from './handlers/getSecret'
import { listWebhooks } from './handlers/list'
import { listWebhookLogs, ListWebhookLogsOptions } from './handlers/listLogs'
import { rotateWebhookSigningSecret } from './handlers/rotateSecret'
import { testWebhook } from './handlers/test'
import { updateWebhook } from './handlers/update'
import { updateWebhookStatus } from './handlers/updateStatus'

export class WebhooksAPI {
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

  private validateIdentifiers(webhookId?: string) {
    const { project, environment } = this

    if (!isValidProjectIdentifier(project)) {
      const error = invalidProjectIdentifierError
      return error
    }

    if (!isValidProjectIdentifier(environment)) {
      const error = invalidEnvironmentIdentifierError
      return error
    }

    if (webhookId && !isValidWebhookId(webhookId)) {
      const error = invalidWebhookIdError
      return error
    }
  }

  private getSingleWebhookHandlerArgs(webhookId: string) {
    return {
      client: this.httpClient,
      project: this.project,
      environment: this.environment,
      webhookId,
    }
  }

  /**
   * Lists all webhooks for a specific project and environment.
   *
   * @returns A promise that resolves to an array of webhook objects or an error response.
   */
  public async list() {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

    return await listWebhooks(this.getHandlerArgs())
  }

  /**
   * Lists logs for a specific webhook.
   *
   * @param webhookId - The id of the webhook.
   * @param opts - Optional parameters for listing webhook logs.
   * @param opts.page - The page number for pagination (optional).
   * @param opts.limit - The number of logs to return per page (optional).
   * @returns A promise that resolves to an array of webhook log objects with pagination metadata or an error response.
   */
  async listLogs(webhookId: string, opts?: ListWebhookLogsOptions) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    if (opts?.page !== undefined) {
      const page = opts.page

      if (page <= 0 || page > 1000 || typeof page !== 'number') {
        const error = invalidWebhookLogsPageError
        return responseFailure(error)
      }
    }

    if (opts?.limit !== undefined) {
      const limit = opts.limit

      if (limit < 2 || limit > 1000 || typeof limit !== 'number') {
        const error = invalidWebhookLogsLimitError
        return responseFailure(error)
      }
    }

    return await listWebhookLogs({
      ...this.getHandlerArgs(),
      webhookId,
      opts,
    })
  }

  /**
   * Retrieves a single webhook by its id from a specific project and environment.
   *
   * @param webhookId - The id of the webhook to retrieve.
   * @param withSecret - Whether to include the webhook secret in the response.
   * @returns A promise that resolves to the webhook object identifiers (id, name) or an error response.
   */
  async get(webhookId: string, withSecret?: boolean) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await getWebhook({
      ...this.getSingleWebhookHandlerArgs(webhookId),
      withSecret,
    })
  }

  /**
   * Creates a new webhook in a specific project and environment.
   *
   * @param data - The webhook data to create.
   * @returns A promise that resolves to the created webhook object or an error response.
   */
  async create(data: CreateWebhookData) {
    const validationError = this.validateIdentifiers()
    if (validationError) return responseFailure(validationError)

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

    return await createWebhook({
      ...this.getHandlerArgs(),
      data,
    })
  }

  /**
   * Enables a webhook in a specific project and environment.
   *
   * @param webhookId - The id of the webhook to enable.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async enable(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await updateWebhookStatus({
      ...this.getSingleWebhookHandlerArgs(webhookId),
      enabled: true,
    })
  }

  /**
   * Disables a webhook in a specific project and environment.
   *
   * @param webhookId - The id of the webhook to disable.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async disable(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await updateWebhookStatus({
      ...this.getSingleWebhookHandlerArgs(webhookId),
      enabled: false,
    })
  }

  /**
   * Updates an existing webhook in a specific project and environment.
   *
   * @param webhookId - The id of the webhook to update.
   * @param data - The webhook data to update.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async update(webhookId: string, data: UpdateWebhookData) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

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

    return await updateWebhook({
      ...this.getSingleWebhookHandlerArgs(webhookId),
      data,
    })
  }

  /**
   * Tests a webhook in a specific project and environment.
   *
   * @param webhookId - The id of the webhook to test.
   * @returns A promise that resolves to the test result or an error response.
   */
  async test(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await testWebhook(this.getSingleWebhookHandlerArgs(webhookId))
  }

  /**
   * Deletes a webhook from a specific project and environment.
   *
   * @param webhookId - The id of the webhook to delete.
   * @returns A promise that resolves to null on success or an error response.
   */
  async delete(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await deleteWebhook(this.getSingleWebhookHandlerArgs(webhookId))
  }

  /**
   * Retrieves the signing secret for a specific webhook in a project and environment.
   *
   * @param webhookId - The id of the webhook.
   * @returns A promise that resolves to the signing secret or an error response.
   */
  async getSigningSecret(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await getWebhookSigningSecret(this.getSingleWebhookHandlerArgs(webhookId))
  }

  /**
   * Rotates the signing secret for a specific webhook in a project and environment.
   *
   * @param webhookId - The id of the webhook.
   * @returns A promise that resolves to the new signing secret or an error response.
   */
  async rotateSigningSecret(webhookId: string) {
    const validationError = this.validateIdentifiers(webhookId)
    if (validationError) return responseFailure(validationError)

    return await rotateWebhookSigningSecret(this.getSingleWebhookHandlerArgs(webhookId))
  }
}
