import { HttpClient } from '../../../../http/client'
import { createApiErrorFromResponse } from '../../../../errors'
import { SingleWebhookProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { GetWebhookError as SharedGetWebhookError } from '../../../../types/errors/webhooks'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'

export type UpdateWebhookStatusArgs = SingleWebhookProjectEnvHandlerArgs<undefined>

export type UpdateWebhookStatusError =
  | SharedGetWebhookError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

async function updateWebhookStatus(
  cliient: HttpClient,
  args: UpdateWebhookStatusArgs,
  enabled: boolean
): Promise<ApiResponse<null, UpdateWebhookStatusError>> {
  const { project, environment, webhookId } = args

  try {
    await cliient.patch<null>({
      path: `/v1/projects/${project}/environments/${environment}/webhooks/${webhookId}/status`,
      data: { enabled },
    })

    return responseSuccess(null)
  } catch (error) {
    const apiError = createApiErrorFromResponse<UpdateWebhookStatusError>(error)
    return responseFailure(apiError)
  }
}

export { updateWebhookStatus }
