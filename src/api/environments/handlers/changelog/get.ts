import { createApiErrorFromResponse } from '../../../../errors'
import { HttpClient } from '../../../../http/client'
import { ApiResponse, responseFailure, responseSuccess } from '../../../../http/response'
import { ChangelogItemWithValues } from '../../../../types/changelog'
import { GetChangelogChangeError } from '../../../../types/errors/changelog'

export interface GetChangelogChangeArgs {
  client: HttpClient
  changeId: string
}

async function getChangelogChange(
  args: GetChangelogChangeArgs
): Promise<ApiResponse<ChangelogItemWithValues, GetChangelogChangeError>> {
  const { client, changeId } = args

  try {
    const changelog = await client.get<ChangelogItemWithValues>({
      path: `/v1/changelog/${changeId}`,
    })

    return responseSuccess(changelog)
  } catch (error) {
    const apiError = createApiErrorFromResponse<GetChangelogChangeError>(error)
    return responseFailure(apiError)
  }
}

export { getChangelogChange }
