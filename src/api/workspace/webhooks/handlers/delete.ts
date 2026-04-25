import { GetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { ApiResponse } from '../../../../http/response'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type DeleteWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type DeleteWebhookErrorCode = GetWebhookErrorCode | EnvironmentContextErrorCode

async function deleteWebhook(
  args: DeleteWebhookArgs
): Promise<ApiResponse<null, DeleteWebhookErrorCode>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<null, DeleteWebhookErrorCode>({
    method: 'DELETE',
    path,
  })
}

export { deleteWebhook }
