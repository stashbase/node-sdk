import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookErrorCode } from '../../../../types/errors/webhooks'

async function deleteWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<null, GetWebhookErrorCode>> {
  return await envClient.sendApiRequest<null, GetWebhookErrorCode>({
    method: 'DELETE',
    path: `/v1/environment/webhooks/${webhookId}`,
  })
}

export { deleteWebhook }
