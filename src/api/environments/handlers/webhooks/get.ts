import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { SingleWebhookArgs } from '../../../../types/arguments'
import { GetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { ApiResponse } from '../../../../http/response'

export type GetWebhookArgs = SingleWebhookArgs<{
  /** Whether to include the webhook's signing secret in the response */
  includeSecret: boolean
}>

// Keep the original type definition
type WebhookWithConditionalSecret<T extends boolean | undefined> = T extends true
  ? Webhook & { signingSecret: string }
  : Webhook & { signingSecret: undefined }

// Make the function generic
async function getWebhook<T extends boolean>(
  envClient: HttpClient,
  args: GetWebhookArgs & { includeSecret: T }
): Promise<ApiResponse<WebhookWithConditionalSecret<T>, GetWebhookErrorCode>> {
  const { webhookId, includeSecret } = args

  return envClient.sendApiRequest<WebhookWithConditionalSecret<T>, GetWebhookErrorCode>({
    method: 'GET',
    path: `/v1/environment/webhooks/${webhookId}`,
    query: includeSecret === true ? { include_secret: true } : undefined,
  })
}

export { getWebhook }
