import { HttpClient } from '../../../../http/client'
import { CreateWebhookData, CreateWebhookResponse } from '../../../../types/webhooks'
import { CreateWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse } from '../../../../http/response'

async function createWebhook(
  envClient: HttpClient,
  data: CreateWebhookData
): Promise<ApiResponse<CreateWebhookResponse, CreateWebhookError>> {
  return await envClient.sendApiRequest<CreateWebhookResponse, CreateWebhookError>({
    method: 'POST',
    path: '/v1/webhooks',
    data,
  })
}

export { createWebhook }
