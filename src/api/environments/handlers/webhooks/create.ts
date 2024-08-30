import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { CreateWebhookData, CreateWebhookResponse } from '../../../../types/webhooks'
import { CreateWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function createWebhook(
  envClient: HttpClient,
  data: CreateWebhookData
): Promise<ApiResponse<CreateWebhookResponse, CreateWebhookError>> {
  try {
    const webhook = await envClient.post<CreateWebhookResponse>({
      path: '/v1/webhooks',
      data,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<CreateWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { createWebhook }
