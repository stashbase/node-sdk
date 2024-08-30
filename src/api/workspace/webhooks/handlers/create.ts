import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { CreateWebhookData } from '../../../../types/webhooks'
import { CreateWebhookResponse } from '../../../../types/webhooks'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'

export type CreateWebhookArgs = ProjectEnvHandlerArgs<{
  data: CreateWebhookData
}>

async function createWebhook(
  args: CreateWebhookArgs
): Promise<ApiResponse<CreateWebhookResponse, GetWebhookError>> {
  const { client } = args
  const { project, environment, data } = args

  try {
    const createdWebhook = await client.post<CreateWebhookResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks`,
      data,
    })

    return responseSuccess(createdWebhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { createWebhook }
