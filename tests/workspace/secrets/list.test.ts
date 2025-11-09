import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('List secrets', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(
      'sbs_ElRbXgfhk0Y55sSrQkjHwsBOpRaK7DdsfFBVpqxW8a8KxAbMbEvmLHFY'
    )

    const { data, error } = await client
      .secrets({ project: 'test', environment: 'api-dev' })
      .listOnly(['SECRET_1', 'SECRET_2'])

    console.log(data)
    console.log(error)
  })
})
