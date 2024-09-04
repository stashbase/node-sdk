import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { RotateWebhookSigningSecretError } from '../../../../types/errors/webhooks'

export type RotateWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function rotateWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretError>> {
  return await envClient.sendApiRequest<WebhookSigningSecret, RotateWebhookSigningSecretError>({
    method: 'POST',
    path: `/v1/webhooks/${webhookId}/signing-secret`,
  })
}

export { rotateWebhookSigningSecret }
