import { HttpClient } from '../../../../http/client'
import { CreateWebhookData, WebhookWithSigningSecret } from '../../../../types/webhooks'
import { CreateWebhookErrorCode } from '../../../../types/errors/webhooks'
import { ApiResponse } from '../../../../http/response'

async function createWebhook(
  envClient: HttpClient,
  data: CreateWebhookData
): Promise<ApiResponse<WebhookWithSigningSecret, CreateWebhookErrorCode>> {
  return await envClient.sendApiRequest<WebhookWithSigningSecret, CreateWebhookErrorCode>({
    method: 'POST',
    path: '/v1/environment/webhooks',
    data,
  })
}

export { createWebhook }
