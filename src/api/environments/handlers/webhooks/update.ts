import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { UpdateWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
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

  try {
    const webhook = await envClient.patch<null>({
      path: `/v1/webhooks/${webhookId}`,
      data,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhook }
