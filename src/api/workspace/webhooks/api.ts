import { HttpClient } from '../../../http/client'
export class WebhooksAPI {
  private httpClient: HttpClient

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient
  }
}
