import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ListChangelogOptions, ListChangelogResponse } from '../../../../types/changelog'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { ListChangelogError as SharedListChangelogError } from '../../../../types/errors/changelog'
import { InvalidEnvironmentIdentifierError } from '../../../../types/errors/environments'
import { InvalidIdentifierProjectError } from '../../../../types/errors/projects'

export type ListChangelogError =
  | SharedListChangelogError
  | InvalidIdentifierProjectError
  | InvalidEnvironmentIdentifierError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

type ListChangelogArgs = ProjectEnvHandlerArgs<{
  withValues?: boolean
  options?: ListChangelogOptions
}>

async function listChangelog(
  args: ListChangelogArgs
): Promise<ApiResponse<ListChangelogResponse<typeof args.withValues>, ListChangelogError>> {
  const { client, project, environment, options } = args

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

  try {
    const changelog = await client.get<ListChangelogResponse<typeof args.withValues>>({
      path: `/v1/projects/${project}/environments/${environment}/changelog`,
      query,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<ListChangelogError>(error)
    return responseFailure(apiError)
  }
}

export { listChangelog }
