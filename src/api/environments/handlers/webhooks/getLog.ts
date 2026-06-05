import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { SingleWebhookArgs } from '../../../../types/arguments'
import { GetWebhookLogErrorCode } from '../../../../types/errors/webhooks'
import { WebhookLogDetails } from '../../../../types/webhooks'

async function getWebhookLog(
  envClient: HttpClient,
  args: SingleWebhookArgs<{ webhookLogId: string }>
): Promise<ApiResponse<WebhookLogDetails, GetWebhookLogErrorCode>> {
  const { webhookId, webhookLogId } = args

  return await envClient.sendApiRequest<WebhookLogDetails, GetWebhookLogErrorCode>({
    method: 'GET',
    path: `/v1/environment/webhooks/${webhookId}/logs/${webhookLogId}`,
  })
}

export { getWebhookLog }
