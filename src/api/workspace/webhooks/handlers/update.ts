import { HttpClient } from '../../../../http/client'
import { TestWebhookResponse } from '../../../../types/webhooks'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { UpdateWebhookData } from '../../../environments/handlers/webhooks/update'

export type UpdateWebhookArgs = ProjectEnvHandlerArgs<{
  webhookId: string
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
