import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { GetWebhookErrorCode as SharedGetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type RotateWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type RotateWebhookSigningSecretErrorCode = SharedGetWebhookErrorCode | EnvironmentContextErrorCode

async function rotateWebhookSigningSecret(
  args: RotateWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretErrorCode>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`

  return await client.sendApiRequest<WebhookSigningSecret, RotateWebhookSigningSecretErrorCode>({
    method: 'POST',
    path,
  })
}

export { rotateWebhookSigningSecret }
