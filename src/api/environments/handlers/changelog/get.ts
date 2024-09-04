import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
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

  const path = `/v1/changelog/${changeId}`

  return client.sendApiRequest<ChangelogItemWithValues, GetChangelogChangeError>({
    method: 'GET',
    path,
  })
}

export { getChangelogChange }
