import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { ListWebhooksError } from '../../../../types/errors/webhooks'

async function listWebhooks(
  envClient: HttpClient
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksError>> {
  return await envClient.sendApiRequest<ListWebhooksResponse, ListWebhooksError>({
    method: 'GET',
    path: '/v1/webhooks',
  })
}

export { listWebhooks }
