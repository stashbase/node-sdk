import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ListWebhookLogsResponse } from '../../../../types/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhooksError as SharedListWebhooksError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type ListWebhookLogsArgs = SingleWebhookProjectEnvHandlerArgs<{
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
    const webhookLogs = await client.get<ListWebhookLogsResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs`,
    })

    return responseSuccess(webhookLogs)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhookLogsError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhookLogs }
