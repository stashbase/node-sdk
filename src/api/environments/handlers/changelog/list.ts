import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { ListChangelogOptions, ListChangelogResponse } from '../../../../types/changelog'
import { ListChangelogError } from '../../../../types/errors/changelog'

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
    query['with-values'] = 'true'
  }

  if (options?.page) {
    query.page = options.page
  }

  if (options?.limit) {
    query.limit = options.limit
  }

  const path = '/v1/changelog'

  return client.sendApiRequest<ListChangelogResponse<typeof args.withValues>, ListChangelogError>({
    method: 'GET',
    path,
    query,
  })
}

export { listChangelog }
