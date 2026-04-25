import { HttpClient } from '../../../../http/client'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookSigningSecretErrorCode } from '../../../../types/errors/webhooks'
import { SingleWebhookArgs } from '../../../../types/arguments'

export type GetWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function getWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretErrorCode>> {
  return await envClient.sendApiRequest<WebhookSigningSecret, GetWebhookSigningSecretErrorCode>({
    method: 'GET',
    path: `/v1/environment/webhooks/${webhookId}/signing-secret`,
  })
}

export { getWebhookSigningSecret }
