import { ApiResponse } from '../../../../http/response'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { CreateWebhookData } from '../../../../types/webhooks'
import { CreateWebhookResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type CreateWebhookArgs = ProjectEnvHandlerArgs<{
  data: CreateWebhookData
}>

async function createWebhook(
  args: CreateWebhookArgs
): Promise<ApiResponse<CreateWebhookResponse, GetWebhookError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`

  return await client.sendApiRequest<CreateWebhookResponse, GetWebhookError>({
    method: 'POST',
    path,
    data,
  })
}

export { createWebhook }
