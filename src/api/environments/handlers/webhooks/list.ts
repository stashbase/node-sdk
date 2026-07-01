import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListWebhooksOptions, ListWebhooksResponse } from '../../../../types/webhooks'
import { ListWebhooksErrorCode } from '../../../../types/errors/webhooks'
import { stringToSnakeCase } from '../../../../utils/serializer'

async function listWebhooks(
  envClient: HttpClient,
  options?: ListWebhooksOptions
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksErrorCode>> {
  const query: Record<string, string | number | boolean> = {}

  if (options?.sortBy) {
    query.sort_by = stringToSnakeCase(options.sortBy)
  }

  if (options?.order) {
    query.order = options.order
  }

  return await envClient.sendApiRequest<ListWebhooksResponse, ListWebhooksErrorCode>({
    method: 'GET',
    path: '/v1/environment/webhooks',
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { listWebhooks }
