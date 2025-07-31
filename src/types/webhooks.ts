import { PaginationMetadata } from './pagination'
import { AtLeastOne } from './util'

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
  /** The list of webhook logs */
  data: Array<WebhookLog>
  /** The pagination metadata */
  pagination: PaginationMetadata
}

export interface CreateWebhookData {
  /** The target URL of the webhook (must use HTTPS) */
  url: string
  /** Whether the webhook is enabled  or not (default: false) */
  enabled?: boolean
  /** The description of the webhook */
  description?: string | null
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
  error: string | null
}

// request
export type UpdateWebhookData = AtLeastOne<{
  /** The target URL of the webhook (must use HTTPS) */
  url: string
  /** The description of the webhook */
  description: string | null
}>
