import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhookLogsError, ListWebhooksError } from '../../../../types/errors/webhooks'

export type ListWebhookLogsArgs = {
  webhookId: string
  page?: number
  limit?: number
}

async function listWebhookLogs(
  envClient: HttpClient,
  args: ListWebhookLogsArgs
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsError>> {
  const { page, limit } = args

  const query: Record<string, string | number> = {}

  if (page) {
    query.page = page
  }

  if (limit) {
    query.limit = limit
  }

  try {
    const webhooks = await envClient.get<ListWebhookLogsResponse>({
      path: `/v1/webhooks/${args.webhookId}/logs`,
      query: Object.keys(query).length > 0 ? query : undefined,
    })

    return responseSuccess(webhooks)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhooksError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhookLogs }
