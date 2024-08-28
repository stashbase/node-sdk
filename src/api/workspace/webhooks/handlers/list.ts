import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhooksError as SharedListWebhooksError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type ListWebhooksArgs = ProjectEnvHandlerArgs<undefined>

export type ListWebhooksError =
  | SharedListWebhooksError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function listWebhooks(
  client: HttpClient,
  args: ListWebhooksArgs
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksError>> {
  const { project, environment } = args

  try {
    const webhooks = await client.get<ListWebhooksResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks`,
    })

    return responseSuccess(webhooks)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListWebhooksError>(error)
    return responseFailure(apiError)
  }
}

export { listWebhooks }
