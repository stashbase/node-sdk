import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Delete secrets', async () => {
  const client = createWorkspaceClient(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .secrets({
      project: 'proj_iBgCx5tegfVaKzjywTg2ck',
      environment: 'env_3NCdY7kmbLJpZcpMg4W6wk',
    })
    .delete(['DATABASE_URL'])

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
