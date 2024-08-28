import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { UpdateWebhookStatusError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export interface UpdateWebhookStatusArgs {
  webhookId: string
}

async function updateWebhookStatus(
  envClient: HttpClient,
  webhookId: string,
  enabled: boolean
): Promise<ApiResponse<null, UpdateWebhookStatusError>> {
  try {
    const webhook = await envClient.patch<null>({
      path: `/v1/webhooks/${webhookId}/status`,
      data: { enabled },
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookStatusError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhookStatus }
