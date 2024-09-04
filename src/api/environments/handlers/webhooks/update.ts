import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { UpdateWebhookError } from '../../../../types/errors/webhooks'
import { UpdateWebhookData } from '../../../../types/webhooks'

export type UpdateWebhookArgs = SingleWebhookArgs<{
  /** The data to update the webhook with */
  data: UpdateWebhookData
}>

async function updateWebhook(
  envClient: HttpClient,
  args: UpdateWebhookArgs
): Promise<ApiResponse<null, UpdateWebhookError>> {
  const { webhookId, data } = args

  return await envClient.sendApiRequest<null, UpdateWebhookError>({
    method: 'PATCH',
    path: `/v1/webhooks/${webhookId}`,
    data,
  })
}

export { updateWebhook }
