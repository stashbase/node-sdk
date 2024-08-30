import { HttpClient } from '../../../../http/client'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type GetWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type GetWebhookSigningSecretError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function getWebhookSigningSecret(
  client: HttpClient,
  args: GetWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, GetWebhookSigningSecretError>> {
  const { project, environment, webhookId } = args

  try {
    const webhook = await client.get<WebhookSigningSecret>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookSigningSecretError>(error)
    return responseFailure(apiError)
  }
}

export { getWebhookSigningSecret }
