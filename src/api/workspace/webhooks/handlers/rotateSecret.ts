import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'

export type RotateWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type RotateWebhookSigningSecretError = SharedGetWebhookError | EnvironmentContextError

async function rotateWebhookSigningSecret(
  args: RotateWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretError>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`

  return await client.sendApiRequest<WebhookSigningSecret, RotateWebhookSigningSecretError>({
    method: 'POST',
    path,
  })
}

export { rotateWebhookSigningSecret }
