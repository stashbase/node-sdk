import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateWebhookData } from '../../../../types/webhooks'

export type UpdateWebhookArgs = SingleWebhookProjectEnvHandlerArgs<{
  data: UpdateWebhookData
}>

export type UpdateWebhookError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function updateWebhook(
  client: HttpClient,
  args: UpdateWebhookArgs
): Promise<ApiResponse<null, UpdateWebhookError>> {
  const { project, environment, webhookId, data } = args

  try {
    await client.patch<null>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}`,
      data,
    })

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhook }
