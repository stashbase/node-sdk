import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'

export type DeleteWebhookArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

async function deleteWebhook(args: DeleteWebhookArgs): Promise<ApiResponse<null, GetWebhookError>> {
  const { client, project, environment, webhookId } = args

  try {
    const deleteRes = await client.del<null>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`,
    })

    return responseSuccess(deleteRes)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { deleteWebhook }
