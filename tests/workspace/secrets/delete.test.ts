import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createWorkspaceClient(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await envEase
    .secrets('pr_iBgCx5tegfVaKzjywTg2ck', 'ev_3NCdY7kmbLJpZcpMg4W6wk')
    .delete(['DATABASE_URL'])

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
