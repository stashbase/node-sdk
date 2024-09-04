import { GetWebhookError } from '../../../../types/errors/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse } from '../../../../http/response'

export type DeleteWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

async function deleteWebhook(args: DeleteWebhookArgs): Promise<ApiResponse<null, GetWebhookError>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<null, GetWebhookError>({
    method: 'DELETE',
    path,
  })
}

export { deleteWebhook }
