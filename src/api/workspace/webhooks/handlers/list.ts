import { ApiResponse } from '../../../../http/response'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { EnvironmentContextError, ProjectContextError } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type ListWebhooksError = ProjectContextError | EnvironmentContextError

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
