import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type GetWebhookError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function getWebhook<T extends boolean>(args: {
  client: HttpClient
  project: string
  environment: string
  webhookId: string
  withSecret?: T
}): Promise<
  ApiResponse<Webhook & { signingSecret: T extends true ? string : undefined }, GetWebhookError>
> {
  const { client, project, environment, webhookId, withSecret } = args

  try {
    const webhook = await client.get<
      Webhook & { signingSecret: T extends true ? string : undefined }
    >({
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
