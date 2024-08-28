import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createWorkspaceClient(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await envEase.secrets.remove({
    project: 'pr_iBgCx5tegfVaKzjywTg2ck',
    environment: 'ev_3NCdY7kmbLJpZcpMg4W6wk',
    keys: ['KEYS', 'SECRET_234'],
  })
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
