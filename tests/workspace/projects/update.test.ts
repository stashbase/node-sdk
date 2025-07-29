// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Update project', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client.projects.update('test', {
      description: null,
    })

    console.log(data)
  })
})
