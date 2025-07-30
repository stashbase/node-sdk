import { ApiResponse } from '../../../../http/response'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import {
  InvalidWebhookIdError,
  InvalidWebhookLogsLimitError,
  InvalidWebhookLogsPageError,
  ListWebhooksError as SharedListWebhooksError,
} from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type ListWebhookLogsOptions = {
  /** The page number */
  page?: number
  /** The limit of items per page */
  limit?: number
}

export type ListWebhookLogsError =
  | InvalidWebhookIdError
  | EnvironmentContextError
  | InvalidWebhookLogsLimitError
  | InvalidWebhookLogsPageError

async function listWebhookLogs(
  args: SingleWebhookProjectEnvHandlerArgs<{ options?: ListWebhookLogsOptions }>
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsError>> {
  const { client, webhookId, project, environment, options } = args

  const query: Record<string, string | number> = {}

  if (options?.page) {
    query.page = options.page
  }

  if (options?.limit) {
    query.limit = options.limit
  }

  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs`

  return await client.sendApiRequest<ListWebhookLogsResponse, ListWebhookLogsError>({
    method: 'GET',
    path,
    query,
  })
}

export { listWebhookLogs }
