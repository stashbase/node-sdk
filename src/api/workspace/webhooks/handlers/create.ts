import { ApiResponse } from '../../../../http/response'
import { CreateWebhookErrorCode as SharedCreateWebhookErrorCode } from '../../../../types/errors/webhooks'
import { CreateWebhookData } from '../../../../types/webhooks'
import { CreateWebhookResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type CreateWebhookArgs = ProjectEnvHandlerArgs<{
  data: CreateWebhookData
}>

type CreateWebhookErrorCode = SharedCreateWebhookErrorCode | EnvironmentContextErrorCode

async function createWebhook(
  args: CreateWebhookArgs
): Promise<ApiResponse<CreateWebhookResponse, CreateWebhookErrorCode>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`

  return await client.sendApiRequest<CreateWebhookResponse, CreateWebhookErrorCode>({
    method: 'POST',
    path,
    data,
  })
}

export { createWebhook }
