import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetWebhookError, GetWebhookSigningSecretError } from '../../../../types/errors/webhooks'

export interface UpdateWebhookStatusArgs {
  webhookId: string
}

async function updateWebhookStatus(
  envClient: HttpClient,
  webhookId: string,
  enabled: boolean
): Promise<ApiResponse<null, GetWebhookSigningSecretError>> {
  try {
    const webhook = await envClient.patch<null>({
      path: `/v1/webhooks/${webhookId}/status`,
      data: { enabled },
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhookStatus }
