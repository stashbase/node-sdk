import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookError } from '../../../../types/errors/webhooks'

async function deleteWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<null, GetWebhookError>> {
  return await envClient.sendApiRequest<null, GetWebhookError>({
    method: 'DELETE',
    path: `/v1/webhooks/${webhookId}`,
  })
}

export { deleteWebhook }
