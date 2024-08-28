import { PaginationMetadata } from './pagination'

export interface Webhook {
  /** The unique identifier of the webhook */
  id: string

  /** The target URL of the webhook */
  url: string

  /** Whether the webhook is enabled  or not*/
  enabled: boolean

  /** The creation datetime of the webhook */
  createdAt: string

  /** The description of the webhook */
  description: string | null

  // /** The signing secret of the webhook */
  // signingSecret?: string
}

export type WebhookListItem = Pick<Webhook, 'id' | 'url' | 'enabled'>
export type ListWebhooksResponse = WebhookListItem[]

export interface WebhookLog {
  /** The HTTP response status code */
  status: number

  /** Datetime of when the webhook was processed */
  processedAt: string

  /** The number of the webook delivery attempt */
  attempt: number

  /** The error code the webhook failed to be delivered */
  error: string | null
}

export interface ListWebhookLogsResponse {
  data: Array<WebhookLog>
  pagination: PaginationMetadata
}

export interface CreateWebhookResponse {
  /** The unique identifier of the webhook */
  id: string

  /** The singing secret of the webhook */
  signingSecret: string
}

export interface WebhookSigningSecret {
  /** The singing secret of the webhook */
  signingSecret: string
}

export interface TestWebhookResponse {
  /** The target URL of the webhook */
  url: string

  /** The HTTP response status code of the webhook delivery attempt */
  status: number

  /** The error code of failed webhook delivery attempt */
  error: string
}
