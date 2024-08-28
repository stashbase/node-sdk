import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type GetWebhookArgs = ProjectEnvHandlerArgs<{
  webhookId: string
  withSecret?: boolean // Change this to be required and always boolean
}>

export type GetWebhookError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

type WebhookWithConditionalSecret<T extends boolean | undefined> = T extends true
  ? Webhook & { signingSecret: string }
  : Webhook & { signingSecret: undefined }

async function getWebhook<T extends boolean>(
  client: HttpClient,
  args: GetWebhookArgs & { withSecret: T }
): Promise<ApiResponse<WebhookWithConditionalSecret<T>, GetWebhookError>> {
  const { project, environment, webhookId, withSecret } = args

  try {
    const webhook = await client.get<WebhookWithConditionalSecret<T>>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`,
      query: withSecret ? { 'with-secret': true } : undefined,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { getWebhook }
