import { createApiErrorFromResponse } from '../../../../errors'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ProjectEnvHandlerArgs } from '../../../../types/aruguments'
import { ChangelogItemWithValues } from '../../../../types/changelog'
import { EnvironmentNotFoundError, ProjectNotFoundError } from '../../../../types/errors'
import { GetChangelogChangeError as SharedGetChagelogChangeError } from '../../../../types/errors/changelog'

export type GetChangelogChangeError =
  | SharedGetChagelogChangeError
  | ProjectNotFoundError
  | EnvironmentNotFoundError

type GetChangelogChangeArgs = ProjectEnvHandlerArgs<{
  changeId: string
}>

async function getChangelogChange(
  args: GetChangelogChangeArgs
): Promise<ApiResponse<ChangelogItemWithValues, GetChangelogChangeError>> {
  const { client, project, environment, changeId } = args

  try {
    const changelog = await client.get<ChangelogItemWithValues>({
      path: `/v1/projects/${project}/environments/${environment}/changelog/${changeId}`,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetChangelogChangeError>(error)
    return responseFailure(apiError)
  }
}

export { getChangelogChange }
