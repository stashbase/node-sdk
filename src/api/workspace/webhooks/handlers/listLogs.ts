import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhooksError as SharedListWebhooksError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type ListWebhookLogsArgs = ProjectEnvHandlerArgs<{
  /** The webhook id */
  webhookId: string
  /** The page number */
  page?: number
  /** The limit of items per page */
  limit?: number
}>

export type ListWebhookLogsError =
  | SharedListWebhooksError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function listWebhookLogs(
  client: HttpClient,
  args: ListWebhookLogsArgs
): Promise<ApiResponse<ListWebhookLogsResponse, ListWebhookLogsError>> {
  const { project, environment, webhookId } = args

  try {
    const webhooks = await client.get<ListWebhookLogsResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs`,
    })

    return responseSuccess(webhooks)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhookLogsError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhookLogs }
