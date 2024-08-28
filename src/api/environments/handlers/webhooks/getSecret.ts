import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetWebhookError, GetWebhookSigningSecretError } from '../../../../types/errors/webhooks'

export interface GetWebhookSigningSecretArgs {
  webhookId: string
}

async function getWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  try {
    const webhook = await envClient.get<WebhookSigningSecret>({
      path: `/v1/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { getWebhookSigningSecret }
