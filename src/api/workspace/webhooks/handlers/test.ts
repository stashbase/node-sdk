import { HttpClient } from '../../../../http/client'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type TestWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type TestWebhookError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function testWebhook(
  client: HttpClient,
  args: TestWebhookArgs
): Promise<ApiResponse<TestWebhookResponse, TestWebhookError>> {
  const { project, environment, webhookId } = args

  try {
    const testRes = await client.post<TestWebhookResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/test`,
    })

    return responseSuccess(testRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<TestWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { testWebhook }
