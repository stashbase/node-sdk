import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { GetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { CreateWebhookData } from '../../../environments/handlers/webhooks/create'
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
    const webhook = await client.post<CreateWebhookResponse>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks`,
      data,
    })

    return responseSuccess(webhook)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetWebhookError>(error)
    return responseFailure(apiError)
  }
}

export { createWebhook }
