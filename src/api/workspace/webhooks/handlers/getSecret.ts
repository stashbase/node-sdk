import { ApiResponse } from '../../../../http/response'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'

export type GetWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>
export type GetWebhookSigningSecretError = SharedGetWebhookError | EnvironmentContextError

async function getWebhookSigningSecret(
  args: GetWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`

  return await client.sendApiRequest<WebhookSigningSecret, GetWebhookSigningSecretError>({
    method: 'GET',
    path,
  })
}

export { getWebhookSigningSecret }
