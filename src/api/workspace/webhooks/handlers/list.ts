import { createApiErrorFromResponse } from '../../../../errors'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListWebhooksError as SharedListWebhooksError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type ListWebhooksError =
  | SharedListWebhooksError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function listWebhooks(
  args: ProjectEnvHandlerArgs<undefined>
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksError>> {
  const { client, project, environment } = args

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
