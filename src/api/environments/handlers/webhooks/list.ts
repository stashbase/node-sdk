import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { ListWebhooksErrorCode } from '../../../../types/errors/webhooks'

async function listWebhooks(
  envClient: HttpClient
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksErrorCode>> {
  return await envClient.sendApiRequest<ListWebhooksResponse, ListWebhooksErrorCode>({
    method: 'GET',
    path: '/v1/environment/webhooks',
  })
}

export { listWebhooks }
