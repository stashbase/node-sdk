import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Set secrets', () => {
  test('', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase
      .secrets('proj_iBgCx5tegfVaKzjywTg2ck', 'env_3NCdY7kmbLJpZcpMg4W6wk')
      .set([
        {
          key: 'KEYS',
          value: '123',
        },
        {
          key: 'SECRET_234',
          value: 'SECRET_234',
        },
      ])

    console.log(data)
    console.log(error)

    if (error?.code?.startsWith('validation')) {
      console.log(`Validation error: `, error.message)
    }
  })
})
