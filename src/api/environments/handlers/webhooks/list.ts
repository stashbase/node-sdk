import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ListWebhooksError } from '../../../../types/errors/webhooks'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

async function listWebhooks(
  envClient: HttpClient
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksError>> {
  try {
    const webhooks = await envClient.get<ListWebhooksResponse>({
      path: '/v1/webhooks',
    })

    return responseSuccess(webhooks)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhooksError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhooks }
