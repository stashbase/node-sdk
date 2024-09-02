import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('List secrets', () => {
  test('OK', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const secrets = envEase.secrets('proj_iBgCx5tegfVaKzjywTg2ck', 'env_3NCdY7kmbLJpZcpMg4W6wk')
    const { data, error } = await secrets.list()

    console.log(data)
    console.log(error)
  })
})
