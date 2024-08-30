import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { UpdateWebhookStatusError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type UpdateWebhookStatusArgs = SingleWebhookArgs<undefined>

async function updateWebhookStatus(
  envClient: HttpClient,
  webhookId: string,
  enabled: boolean
): Promise<ApiResponse<null, UpdateWebhookStatusError>> {
  try {
    const updateRes = await envClient.patch<null>({
      path: `/v1/webhooks/${webhookId}/status`,
      data: { enabled },
    })

    return responseSuccess(updateRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookStatusError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhookStatus }
