import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { CreateWebhookData } from '../../../../types/webhooks'
import { CreateWebhookResponse } from '../../../../types/webhooks'

export type CreateWebhookArgs = ProjectEnvHandlerArgs<{
  data: CreateWebhookData
}>

async function createWebhook(
  client: HttpClient,
  args: CreateWebhookArgs
): Promise<ApiResponse<CreateWebhookResponse, GetWebhookError>> {
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
