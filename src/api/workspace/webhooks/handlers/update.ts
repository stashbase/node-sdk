import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { UpdateWebhookError as SharedUpdateWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'
import { UpdateWebhookData } from '../../../../types/webhooks'

export type UpdateWebhookArgs = SingleWebhookProjectEnvHandlerArgs<{
  data: UpdateWebhookData
}>

export type UpdateWebhookError = SharedUpdateWebhookError | EnvironmentContextError

async function updateWebhook(
  args: UpdateWebhookArgs
): Promise<ApiResponse<null, UpdateWebhookError>> {
  const { client, project, environment, webhookId, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<null, UpdateWebhookError>({
    method: 'PATCH',
    path,
    data,
  })
}

export { updateWebhook }
