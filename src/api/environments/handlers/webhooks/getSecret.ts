import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { GetWebhookError, GetWebhookSigningSecretError } from '../../../../types/errors/webhooks'
import { SingleWebhookArgs } from '../../../../types/aruguments'

export type GetWebhookSigningSecretArgs = SingleWebhookArgs<undefined>

async function getWebhookSigningSecret(
  envClient: HttpClient,
  webhookId: string
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  try {
    const secretRes = await envClient.get<WebhookSigningSecret>({
      path: `/v1/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(secretRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { getWebhookSigningSecret }
