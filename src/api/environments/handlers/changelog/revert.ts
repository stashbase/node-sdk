import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { RevertChangelogChangeError } from '../../../../types/errors/changelog'

export interface RevertChangelogChangeArgs {
  client: HttpClient
  changeId: string
}

async function revertChangelogChange(
  args: RevertChangelogChangeArgs
): Promise<ApiResponse<null, RevertChangelogChangeError>> {
  const { client, changeId } = args

  try {
    const changelog = await client.post<null>({
      path: `/v1/changelog/${changeId}/revert`,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<RevertChangelogChangeError>(error)
    return responseFailure(apiError)
  }
}

export { revertChangelogChange }
