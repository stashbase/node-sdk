import { GetWebhookError } from '../../../../types/errors/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextError } from '../../../../types/errors'

export type DeleteWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type DeleteWebhookError = GetWebhookError | EnvironmentContextError

async function deleteWebhook(
  args: DeleteWebhookArgs
): Promise<ApiResponse<null, DeleteWebhookError>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<null, DeleteWebhookError>({
    method: 'DELETE',
    path,
  })
}

export { deleteWebhook }
