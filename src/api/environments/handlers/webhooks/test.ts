import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { TestWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function testWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<TestWebhookResponse, TestWebhookError>> {
  try {
    const testRes = await envClient.post<TestWebhookResponse>({
      path: `/v1/webhooks/${webhookId}/test`,
    })

    return responseSuccess(testRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<TestWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { testWebhook }
