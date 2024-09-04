import { ApiResponse } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { RevertChangeResponse } from '../../../../types/changelog'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { RevertChangelogChangeError as SharedRevertChangelogChangeError } from '../../../../types/errors/changelog'

export type RevertChangelogChangeError =
  | SharedRevertChangelogChangeError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

type RevertChangelogChangeArgs = ProjectEnvHandlerArgs<{
  changeId: string
}>

async function revertChangelogChange(
  args: RevertChangelogChangeArgs
): Promise<ApiResponse<RevertChangeResponse, RevertChangelogChangeError>> {
  const { client, project, environment, changeId } = args
  const path = `/v1/projects/${project}/environments/${environment}/changelog/${changeId}/revert`

  return await client.sendApiRequest<RevertChangeResponse, RevertChangelogChangeError>({
    method: 'POST',
    path,
  })
}

export { revertChangelogChange }
