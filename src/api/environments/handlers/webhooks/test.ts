import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { UpdateWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function testWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<TestWebhookResponse, UpdateWebhookError>> {
  try {
    const webhook = await envClient.post<TestWebhookResponse>({
      path: `/v1/webhooks/${webhookId}/test`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { testWebhook }
