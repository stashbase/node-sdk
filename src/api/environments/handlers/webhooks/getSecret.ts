import { HttpClient } from '../../../../http/client'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookSigningSecretError } from '../../../../types/errors/webhooks'
import { SingleWebhookArgs } from '../../../../types/aruguments'

export type GetWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function getWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  return await envClient.sendApiRequest<WebhookSigningSecret, GetWebhookSigningSecretError>({
    method: 'GET',
    path: `/v1/environment/webhooks/${webhookId}/signing-secret`,
  })
}

export { getWebhookSigningSecret }
