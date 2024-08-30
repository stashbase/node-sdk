import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function deleteWebhook(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<null, GetWebhookError>> {
  try {
    const res = await envClient.del<null>({
      path: `/v1/webhooks/${webhookId}`,
    })

    return responseSuccess(res)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { deleteWebhook }
