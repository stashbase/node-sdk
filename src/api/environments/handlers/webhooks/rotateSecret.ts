import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetWebhookError, GetWebhookSigningSecretError } from '../../../../types/errors/webhooks'

export interface RotateWebhookSigningSecretArgst {
  webhookId: string
}

async function rotateWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  try {
    const webhook = await envClient.post<WebhookSigningSecret>({
      path: `/v1/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { rotateWebhookSigningSecret }
