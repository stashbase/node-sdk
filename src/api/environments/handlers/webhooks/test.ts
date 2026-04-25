import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { TestWebhookErrorCode } from '../../../../types/errors/webhooks'

async function testWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<TestWebhookResponse, TestWebhookErrorCode>> {
  return await envClient.sendApiRequest<TestWebhookResponse, TestWebhookErrorCode>({
    method: 'POST',
    path: `/v1/environment/webhooks/${webhookId}/test`,
  })
}

export { testWebhook }
