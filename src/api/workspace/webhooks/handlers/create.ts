import { ApiResponse } from '../../../../http/response'
import { CreateWebhookError as SharedCreateWebhookError } from '../../../../types/errors/webhooks'
import { CreateWebhookData } from '../../../../types/webhooks'
import { CreateWebhookResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { EnvironmentContextError } from '../../../../types/errors'

export type CreateWebhookArgs = ProjectEnvHandlerArgs<{
  data: CreateWebhookData
}>

type CreateWebhookError = SharedCreateWebhookError | EnvironmentContextError

async function createWebhook(
  args: CreateWebhookArgs
): Promise<ApiResponse<CreateWebhookResponse, CreateWebhookError>> {
  const { client, project, environment, data } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`

  return await client.sendApiRequest<CreateWebhookResponse, CreateWebhookError>({
    method: 'POST',
    path,
    data,
  })
}

export { createWebhook }
