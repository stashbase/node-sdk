import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { TestWebhookError } from '../../../../types/errors/webhooks'

async function testWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<TestWebhookResponse, TestWebhookError>> {
  return await envClient.sendApiRequest<TestWebhookResponse, TestWebhookError>({
    method: 'POST',
    path: `/v1/webhooks/${webhookId}/test`,
  })
}

export { testWebhook }
