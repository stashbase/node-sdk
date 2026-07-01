import { ApiResponse } from '../../../../http/response'
import { ListWebhooksOptions, ListWebhooksResponse } from '../../../../types/webhooks'
import { EnvironmentContextErrorCode, ProjectContextErrorCode } from '../../../../types/errors'
import { ProjectEnvHandlerArgs } from '../../../../types/arguments'
import { InvalidWebhookIdErrorCode } from '../../../../types/errors/webhooks'
import {
  InvalidWebhookOrderErrorCode,
  InvalidWebhookSortByErrorCode,
} from '../../../../types/errors/webhooks'
import { stringToSnakeCase } from '../../../../utils/serializer'

export type ListWebhooksErrorCode =
  | ProjectContextErrorCode
  | EnvironmentContextErrorCode
  | InvalidWebhookIdErrorCode
  | InvalidWebhookSortByErrorCode
  | InvalidWebhookOrderErrorCode

async function listWebhooks(
  args: ProjectEnvHandlerArgs<{ options?: ListWebhooksOptions }>
): Promise<ApiResponse<ListWebhooksResponse, ListWebhooksErrorCode>> {
  const { client, project, environment, options } = args
  const path = `/v1/projects/${project}/environments/${environment}/webhooks`
  const query: Record<string, string | number | boolean> = {}

  if (options?.sortBy) {
    query.sort_by = stringToSnakeCase(options.sortBy)
  }

  if (options?.order) {
    query.order = options.order
  }

  return await client.sendApiRequest<ListWebhooksResponse, ListWebhooksErrorCode>({
    method: 'GET',
    path,
    query: Object.keys(query).length > 0 ? query : undefined,
  })
}

export { listWebhooks }
