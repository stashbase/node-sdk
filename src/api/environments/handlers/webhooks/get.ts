import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse } from '../../../../http/response'

export type GetWebhookArgs = SingleWebhookArgs<{
  /** Whether to include the webhook's signing secret in the response */
  withSecret: boolean
}>

// Update the type to use a boolean instead of boolean | undefined
// type WebhookWithConditionalSecret<T extends boolean> = Omit<Webhook, 'signingSecret'> & {
//   signingSecret: T extends true ? string : undefined
// }

// Keep the original type definition
type WebhookWithConditionalSecret<T extends boolean | undefined> = T extends true
  ? Webhook & { signingSecret: string }
  : Webhook & { signingSecret: undefined }

// Make the function generic
async function getWebhook<T extends boolean>(
  envClient: HttpClient,
  args: GetWebhookArgs & { withSecret: T }
): Promise<ApiResponse<WebhookWithConditionalSecret<T>, GetWebhookError>> {
  const { webhookId, withSecret } = args

  return envClient.sendApiRequest<WebhookWithConditionalSecret<T>, GetWebhookError>({
    method: 'GET',
    path: `/v1/webhooks/${webhookId}`,
    query: withSecret ? { 'with-secret': true } : undefined,
  })
}

export { getWebhook }
