import { HttpClient } from '../../../http/client'
import { listWebhooks, ListWebhooksArgs } from './handlers/list'
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
}
