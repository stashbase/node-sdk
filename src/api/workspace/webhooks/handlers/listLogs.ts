import { ApiResponse } from '../../../../http/response'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { ListWebhookLogsErrorCode as SharedListWebhookLogsErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'

export type ListWebhookLogsOptions = {
  /** The page number */
  page?: number
  /** The number of items per page */
  pageSize?: number
}

export type ListWebhookLogsErrorCode = SharedListWebhookLogsErrorCode | EnvironmentContextErrorCode

async function listWebhookLogs(
  args: SingleWebhookProjectEnvHandlerArgs<{ options?: ListWebhookLogsOptions }>
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsErrorCode>> {
  const { client, webhookId, project, environment, options } = args

  const query: Record<string, string | number> = {}

  if (options?.page) {
    query.page = options.page
  }

  if (options?.pageSize) {
    query.page_size = options.pageSize
  }

  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs`

  return await client.sendApiRequest<ListWebhookLogsResponse, ListWebhookLogsErrorCode>({
    method: 'GET',
    path,
    query,
  })
}

export { listWebhookLogs }
