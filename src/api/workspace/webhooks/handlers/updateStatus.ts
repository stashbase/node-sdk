import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'

export type UpdateWebhookStatusArgs = SingleWebhookProjectEnvHandlerArgs<{ enabled: boolean }>

export type UpdateWebhookStatusError = SharedGetWebhookError | EnvironmentContextError

async function updateWebhookStatus(
  args: UpdateWebhookStatusArgs
): Promise<ApiResponse<null, UpdateWebhookStatusError>> {
  const { client, project, environment, webhookId, enabled } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/status`

  return await client.sendApiRequest<null, UpdateWebhookStatusError>({
    method: 'PATCH',
    path,
    data: { enabled },
  })
}

export { updateWebhookStatus }
