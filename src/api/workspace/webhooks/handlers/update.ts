import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateWebhookData } from '../../../../types/webhooks'

export type UpdateWebhookArgs = SingleWebhookProjectEnvHandlerArgs<{
  data: UpdateWebhookData
}>

export type UpdateWebhookError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

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
