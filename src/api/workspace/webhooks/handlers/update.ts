import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { UpdateWebhookErrorCode as SharedUpdateWebhookErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { UpdateWebhookData } from '../../../../types/webhooks'

export type UpdateWebhookArgs = SingleWebhookProjectEnvHandlerArgs<{
  data: UpdateWebhookData
}>

export type UpdateWebhookErrorCode = SharedUpdateWebhookErrorCode | EnvironmentContextErrorCode

async function updateWebhook(
  args: UpdateWebhookArgs
): Promise<ApiResponse<null, UpdateWebhookErrorCode>> {
  const { client, project, environment, webhookId, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<null, UpdateWebhookErrorCode>({
    method: 'PATCH',
    path,
    data,
  })
}

export { updateWebhook }
