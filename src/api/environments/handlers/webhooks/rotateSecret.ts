import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookArgs } from '../../../../types/arguments'
import { RotateWebhookSigningSecretErrorCode } from '../../../../types/errors/webhooks'

export type RotateWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function rotateWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretErrorCode>> {
  return await envClient.sendApiRequest<WebhookSigningSecret, RotateWebhookSigningSecretErrorCode>({
    method: 'POST',
    path: `/v1/environment/webhooks/${webhookId}/signing-secret`,
  })
}

export { rotateWebhookSigningSecret }
