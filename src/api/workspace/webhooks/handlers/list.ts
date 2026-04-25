import { ApiResponse } from '../../../../http/response'
import { ListWebhooksResponse } from '../../../../types/webhooks'
import { EnvironmentContextErrorCode, ProjectContextErrorCode } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'
import { InvalidWebhookIdErrorCode } from '../../../../types/errors/webhooks'

export type ListWebhooksErrorCode =
  | ProjectContextErrorCode
  | EnvironmentContextErrorCode
  | InvalidWebhookIdErrorCode

async function listWebhooks(
  args: ProjectEnvHandlerArgs<undefined>
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksErrorCode>> {
  const { client, project, environment } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`

  return await client.sendApiRequest<ListWebhooksResponse, ListWebhooksErrorCode>({
    method: 'GET',
    path,
  })
}

export { listWebhooks }
