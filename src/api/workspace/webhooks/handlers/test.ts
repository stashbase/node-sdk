import { ApiResponse } from '../../../../http/response'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { EnvironmentContextError } from '../../../../types/errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'

export type TestWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type TestWebhookError = SharedGetWebhookError | EnvironmentContextError

async function testWebhook(
  args: TestWebhookArgs
): Promise<ApiResponse<TestWebhookResponse, TestWebhookError>> {
  const { client, project, environment, webhookId } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/test`

  return await client.sendApiRequest<TestWebhookResponse, TestWebhookError>({
    method: 'POST',
    path,
  })
}

export { testWebhook }
