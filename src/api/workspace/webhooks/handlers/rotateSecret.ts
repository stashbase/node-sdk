import { WebhookSigningSecret } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type RotateWebhookSigningSecretArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type RotateWebhookSigningSecretError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function rotateWebhookSigningSecret(
  args: RotateWebhookSigningSecretArgs
): Promise<ApiResponse<WebhookSigningSecret, RotateWebhookSigningSecretError>> {
  const { client, project, environment, webhookId } = args

  try {
    const newSecretRes = await client.post<WebhookSigningSecret>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/signing-secret`,
    })

    return responseSuccess(newSecretRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RotateWebhookSigningSecretError>(error)
    return responseFailure(apiError)
  }
}

export { rotateWebhookSigningSecret }
