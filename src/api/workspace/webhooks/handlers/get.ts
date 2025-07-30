import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'

export type GetWebhookError = SharedGetWebhookError | EnvironmentContextError

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
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<
    Webhook & { signingSecret: T extends true ? string : undefined },
    GetWebhookError
  >({
    method: 'GET',
    path,
    query: withSecret ? { 'with-secret': true } : undefined,
  })
}

export { getWebhook }
