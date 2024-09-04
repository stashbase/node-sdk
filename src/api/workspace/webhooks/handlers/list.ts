import { ApiResponse } from '../../../../http/response'
import { ListWebhooksResponse } from '../../../../types/webhooks'
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
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`

  return await client.sendApiRequest<ListWebhooksResponse, ListWebhooksError>({
    method: 'GET',
    path,
  })
}

export { listWebhooks }
