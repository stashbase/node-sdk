import { HttpClient } from '../../../http/client'
import { getWebhook, GetWebhookArgs } from './handlers/get'
import { listWebhooks, ListWebhooksArgs } from './handlers/list'
import { listWebhookLogs, ListWebhookLogsArgs } from './handlers/listLogs'
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
    const withSecret = args.withSecret ?? false
    return await getWebhook(this.httpClient, { ...args, withSecret })
  }
}
