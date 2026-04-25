import { HttpClient } from '../../../../http/client'
import { Webhook } from '../../../../types/webhooks'
import { ApiResponse } from '../../../../http/response'
import { GetWebhookErrorCode as SharedGetWebhookErrorCode } from '../../../../types/errors/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'

export type GetWebhookErrorCode = SharedGetWebhookErrorCode | EnvironmentContextErrorCode

async function getWebhook<T extends boolean>(args: {
  client: HttpClient
  project: string
  environment: string
  webhookId: string
  withSecret?: T
}): Promise<
  ApiResponse<Webhook & { signingSecret: T extends true ? string : undefined }, GetWebhookErrorCode>
> {
  const { client, project, environment, webhookId, withSecret } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`

  return await client.sendApiRequest<
    Webhook & { signingSecret: T extends true ? string : undefined },
    GetWebhookErrorCode
  >({
    method: 'GET',
    path,
    query: withSecret ? { with_secret: true } : undefined,
  })
}

export { getWebhook }
