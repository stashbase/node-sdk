import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Set secrets', () => {
  test('', async () => {
    const client = createWorkspaceClient(
      'sbs_ElRbXgfhk0Y55sSrQkjHwsBOpRaK7DdsfFBVpqxW8a8KxAbMbEvmLHFY'
    )

    const { data, error } = await client
      .secrets({
        project: 'proj_iBgCx5tegfVaKzjywTg2ck',
        environment: 'env_3NCdY7kmbLJpZcpMg4W6wk',
      })
      .set([
        {
          name: 'KEYS',
          value: '123',
        },
        {
          name: 'SECRET_234',
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
