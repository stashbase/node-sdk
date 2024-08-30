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
import {
  isValidHttpsUrl,
  isValidProjectIdentifier,
  isValidWebhookDescription,
  isValidWebhookId,
} from '../../../utils/inputValidation'
import { createWebhook, CreateWebhookArgs } from './handlers/create'
import { deleteWebhook, DeleteWebhookArgs } from './handlers/delete'
import { getWebhook, GetWebhookArgs } from './handlers/get'
import { getWebhookSigningSecret, GetWebhookSigningSecretArgs } from './handlers/getSecret'
import { listWebhooks, ListWebhooksArgs } from './handlers/list'
import { listWebhookLogs, ListWebhookLogsArgs } from './handlers/listLogs'
import { rotateWebhookSigningSecret, RotateWebhookSigningSecretArgs } from './handlers/rotateSecret'
import { testWebhook, TestWebhookArgs } from './handlers/test'
import { updateWebhook, UpdateWebhookArgs } from './handlers/update'
import { updateWebhookStatus, UpdateWebhookStatusArgs } from './handlers/updateStatus'

const validateArgs = (args: { project: string; environment: string; webhookId?: string }) => {
  const { project, environment, webhookId } = args

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

export class WebhooksAPI {
  private httpClient: HttpClient

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient
  }

  /**
   * Lists all webhooks for a specific project and environment.
   *
   * @param args - The arguments for listing webhooks.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @returns A promise that resolves to an array of webhook objects or an error response.
   */
  async list(args: ListWebhooksArgs) {
    return await listWebhooks(this.httpClient, args)
  }

  /**
   * Lists logs for a specific webhook.
   *
   * @param args - The arguments for listing webhook logs.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook.
   * @returns A promise that resolves to an array of webhook log objects with pagination metadata or an error response.
   */
  async listLogs(args: ListWebhookLogsArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    if (args?.page !== undefined) {
      const page = args.page

      if (page <= 0 || page > 1000 || typeof page !== 'number') {
        const error = invalidWebhookLogsPageError
        return responseFailure(error)
      }
    }

    if (args?.limit !== undefined) {
      const limit = args.limit

      if (limit < 2 || limit > 1000 || typeof limit !== 'number') {
        const error = invalidWebhookLogsLimitError
        return responseFailure(error)
      }
    }

    return await listWebhookLogs(this.httpClient, args)
  }

  /**
   * Retrieves a single webhook by its id from a specific project and environment.
   *
   * @param args - The arguments for retrieving a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to retrieve.
   * @param args.withSecret - Whether to include the webhook secret in the response.
   * @returns A promise that resolves to the webhook object identifiers (id, name) or an error response.
   */
  async get(args: GetWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    const withSecret = args.withSecret ?? false
    return await getWebhook(this.httpClient, { ...args, withSecret })
  }

  /**
   * Creates a new webhook in a specific project and environment.
   *
   * @param args - The arguments for creating a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.data - The webhook data to create.
   * @returns A promise that resolves to the created webhook object or an error response.
   */
  async create(args: CreateWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    const { data } = args
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

    return await createWebhook(this.httpClient, args)
  }

  /**
   * Enables a webhook in a specific project and environment.
   *
   * @param args - The arguments for enabling a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to enable.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async enable(args: UpdateWebhookStatusArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await updateWebhookStatus(this.httpClient, args, true)
  }

  /**
   * Disables a webhook in a specific project and environment.
   *
   * @param args - The arguments for disabling a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to disable.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async disable(args: GetWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await updateWebhookStatus(this.httpClient, args, false)
  }

  /**
   * Updates an existing webhook in a specific project and environment.
   *
   * @param args - The arguments for updating a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to update.
   * @param args.data - The webhook data to update.
   * @returns A promise that resolves to the updated webhook object or an error response.
   */
  async update(args: UpdateWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    const data = args.data

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

    return await updateWebhook(this.httpClient, args)
  }

  /**
   * Tests a webhook in a specific project and environment.
   *
   * @param args - The arguments for testing a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to test.
   * @returns A promise that resolves to the test result or an error response.
   */
  async test(args: TestWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await testWebhook(this.httpClient, args)
  }

  /**
   * Deletes a webhook from a specific project and environment.
   *
   * @param args - The arguments for deleting a webhook.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook to delete.
   * @returns A promise that resolves to null on success or an error response.
   */
  async delete(args: DeleteWebhookArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await deleteWebhook(this.httpClient, args)
  }

  /**
   * Retrieves the signing secret for a specific webhook in a project and environment.
   *
   * @param args - The arguments for retrieving the signing secret.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook.
   * @returns A promise that resolves to the signing secret or an error response.
   */
  async getSigningSecret(args: GetWebhookSigningSecretArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await getWebhookSigningSecret(this.httpClient, args)
  }

  /**
   * Rotates the signing secret for a specific webhook in a project and environment.
   *
   * @param args - The arguments for rotating the signing secret.
   * @param args.project - The name or id of the project.
   * @param args.environment - The name or id of the environment.
   * @param args.webhookId - The id of the webhook.
   * @returns A promise that resolves to the new signing secret or an error response.
   */
  async rotateSigningSecret(args: RotateWebhookSigningSecretArgs) {
    const validationError = validateArgs(args)
    if (validationError) return responseFailure(validationError)

    return await rotateWebhookSigningSecret(this.httpClient, args)
  }
}
