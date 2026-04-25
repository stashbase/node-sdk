import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { GetWebhookErrorCode as SharedGetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type UpdateWebhookStatusArgs = SingleWebhookProjectEnvHandlerArgs<{ enabled: boolean }>

export type UpdateWebhookStatusErrorCode = SharedGetWebhookErrorCode | EnvironmentContextErrorCode

async function updateWebhookStatus(
  args: UpdateWebhookStatusArgs
): Promise<ApiResponse<null, UpdateWebhookStatusErrorCode>> {
  const { client, project, environment, webhookId, enabled } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/status`

  return await client.sendApiRequest<null, UpdateWebhookStatusErrorCode>({
    method: 'PATCH',
    path,
    data: { enabled },
  })
}

export { updateWebhookStatus }
