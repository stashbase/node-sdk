import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ListChangelogOptions, ListChangelogResponse } from '../../../../types/changelog'
import { GetChangelogChangeError, ListChangelogError } from '../../../../types/errors/changelog'

export interface ListChangelogArgs {
  client: HttpClient
  withValues?: boolean
  options?: ListChangelogOptions
}

async function listChangelog(
  args: ListChangelogArgs
): Promise<ApiResponse<ListChangelogResponse<typeof args.withValues>, ListChangelogError>> {
  const { client, options } = args

  const query: Record<string, string | number> = {}

  if (args.withValues) {
    query['show-values'] = 'true'
  }

  if (options?.page) {
    query.page = options.page
  }

  if (options?.limit) {
    query.limit = options.limit
  }

  try {
    const changelog = await client.get<ListChangelogResponse<typeof args.withValues>>({
      path: '/v1/changelog',
      query,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListChangelogError>(error)
    return responseFailure(apiError)
  }
}

export { listChangelog }
