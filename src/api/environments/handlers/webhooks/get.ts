import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export interface GetWebhookArgs {
  webhookId: string
  withSecret: boolean // Change this to be required and always boolean
}

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

  try {
    const webhook = await envClient.get<WebhookWithConditionalSecret<T>>({
      path: `/v1/webhooks/${webhookId}`,
      query: withSecret ? { 'with-secret': true } : undefined,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { getWebhook }
