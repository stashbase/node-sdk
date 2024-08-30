import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetWebhookError, RotateWebhookSigningSecretError } from '../../../../types/errors/webhooks'

export type RotateWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function rotateWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretError>> {
  try {
    const newSecretRes = await envClient.post<WebhookSigningSecret>({
      path: `/v1/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(newSecretRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { rotateWebhookSigningSecret }
