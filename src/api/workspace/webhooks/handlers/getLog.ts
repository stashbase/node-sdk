import { ApiResponse } from '../../../../http/response'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { WebhookLogDetails } from '../../../../types/webhooks'
import { GetWebhookLogErrorCode as SharedGetWebhookLogErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type GetWebhookLogErrorCode = SharedGetWebhookLogErrorCode | EnvironmentContextErrorCode

async function getWebhookLog(
  args: SingleWebhookProjectEnvHandlerArgs<{ webhookLogId: string }>
): Promise<ApiResponse<WebhookLogDetails, GetWebhookLogErrorCode>> {
  const { client, project, environment, webhookId, webhookLogId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/logs/${webhookLogId}`

  return await client.sendApiRequest<WebhookLogDetails, GetWebhookLogErrorCode>({
    method: 'GET',
    path,
  })
}

export { getWebhookLog }
