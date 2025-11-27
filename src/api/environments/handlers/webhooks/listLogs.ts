import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { SingleWebhookArgs } from '../../../../types/aruguments'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { ListWebhookLogsError } from '../../../../types/errors/webhooks'

export type ListWebhookLogsArgs = SingleWebhookArgs<{
  /** The page number to retrieve */
  page?: number
  /** The number of logs to retrieve per page */
  pageSize?: number
}>

async function listWebhookLogs(
  envClient: HttpClient,
  args: ListWebhookLogsArgs
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsError>> {
  const { page, pageSize } = args

  const query: Record<string, string | number> = {}

  if (page) {
    query.page = page
  }

  if (pageSize) {
    query['page-size'] = pageSize
  }

  return await envClient.sendApiRequest<ListWebhookLogsResponse, ListWebhookLogsError>({
    method: 'GET',
    path: `/v1/webhooks/${args.webhookId}/logs`,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { listWebhookLogs }
