import { createApiErrorFromResponse } from '../../../../errors'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhooksError as SharedListWebhooksError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type ListWebhookLogsOptions = {
  /** The page number */
  page?: number
  /** The limit of items per page */
  limit?: number
}

export type ListWebhookLogsError =
  | SharedListWebhooksError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function listWebhookLogs(
  args: SingleWebhookProjectEnvHandlerArgs<{ opts?: ListWebhookLogsOptions }>
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsError>> {
  const { client, webhookId, project, environment, opts } = args

  const query: Record<string, string | number> = {}

  if (opts?.page) {
    query.page = opts.page
  }

  if (opts?.limit) {
    query.limit = opts.limit
  }

  try {
    const webhookLogs = await client.get<ListWebhookLogsResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs`,
      query,
    })

    return responseSuccess(webhookLogs)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhookLogsError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhookLogs }
