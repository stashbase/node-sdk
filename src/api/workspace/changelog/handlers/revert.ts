import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
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

  try {
    const changelog = await client.post<RevertChangeResponse>({
      path: `/v1/projects/${project}/environments/${environment}/changelog/${changeId}/revert`,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RevertChangelogChangeError>(error)
    return responseFailure(apiError)
  }
}

export { revertChangelogChange }
