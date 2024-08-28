import { HttpClient } from '../../../../http/client'
import { WebhookSigningSecret } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type RotateWebhookSigningSecretArgs = ProjectEnvHandlerArgs<{
  webhookId: string
}>

export type RotateWebhookSigningSecretError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function rotateWebhookSigningSecret(
  client: HttpClient,
  args: RotateWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretError>> {
  const { project, environment, webhookId } = args

  try {
    const webhook = await client.post<WebhookSigningSecret>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RotateWebhookSigningSecretError>(error)
    return responseFailure(apiError)
  }
}

export { rotateWebhookSigningSecret }
