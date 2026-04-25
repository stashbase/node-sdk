import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { SingleWebhookArgs } from '../../../../types/arguments'
import { UpdateWebhookStatusErrorCode } from '../../../../types/errors/webhooks'

export type UpdateWebhookStatusArgs = SingleWebhookArgs<undefined>

async function updateWebhookStatus(
  envClient: HttpClient,
  webhookId: string,
  enabled: boolean
): Promise<ApiResponse<null, UpdateWebhookStatusErrorCode>> {
  return await envClient.sendApiRequest<null, UpdateWebhookStatusErrorCode>({
    method: 'PATCH',
    path: `/v1/environment/webhooks/${webhookId}/status`,
    data: { enabled },
  })
}

export { updateWebhookStatus }
