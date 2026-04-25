import { ApiResponse } from '../../../../http/response'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { EnvironmentContextErrorCode } from '../../../../types/errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/arguments'
import { GetWebhookErrorCode as SharedGetWebhookErrorCode } from '../../../../types/errors/webhooks'

export type TestWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type TestWebhookErrorCode = SharedGetWebhookErrorCode | EnvironmentContextErrorCode

async function testWebhook(
  args: TestWebhookArgs
): Promise<ApiResponse<TestWebhookResponse, TestWebhookErrorCode>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/test`

  return await client.sendApiRequest<TestWebhookResponse, TestWebhookErrorCode>({
    method: 'POST',
    path,
  })
}

export { testWebhook }
