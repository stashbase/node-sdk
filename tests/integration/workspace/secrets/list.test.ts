import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'

describe('List secrets', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client
      .secrets({ project: 'test', environment: 'api-dev' })
      .listOnly(['SECRET_1', 'SECRET_2'])

    console.log(data)
    console.log(error)
  })
})
