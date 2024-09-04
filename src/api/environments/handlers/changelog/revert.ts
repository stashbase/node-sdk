import { HttpClient } from '../../../../http/client'
import { ApiResponse } from '../../../../http/response'
import { RevertChangeResponse } from '../../../../types/changelog'
import { RevertChangelogChangeError } from '../../../../types/errors/changelog'

export interface RevertChangelogChangeArgs {
  client: HttpClient
  changeId: string
}

async function revertChangelogChange(
  args: RevertChangelogChangeArgs
): Promise<ApiResponse<RevertChangeResponse, RevertChangelogChangeError>> {
  const { client, changeId } = args

  const path = `/v1/changelog/${changeId}/revert`

  return client.sendApiRequest<RevertChangeResponse, RevertChangelogChangeError>({
    method: 'POST',
    path,
  })
}

export { revertChangelogChange }
