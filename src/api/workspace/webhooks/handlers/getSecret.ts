import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { GetWebhookErrorCode as SharedGetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type GetWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type GetWebhookSigningSecretErrorCode = SharedGetWebhookErrorCode | EnvironmentContextErrorCode

async function getWebhookSigningSecret(
  args: GetWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretErrorCode>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`

  return await client.sendApiRequest<WebhookSigningSecret, GetWebhookSigningSecretErrorCode>({
    method: 'GET',
    path,
  })
}

export { getWebhookSigningSecret }
