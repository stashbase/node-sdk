import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type DeleteWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

async function deleteWebhook(
  client: HttpClient,
  args: DeleteWebhookArgs
): Promise<ApiResponse<null, GetWebhookError>> {
  const { project, environment, webhookId } = args

  try {
    const webhook = await client.del<null>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { deleteWebhook }
