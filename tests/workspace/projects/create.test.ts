// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Create project', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client.projects.create({
      name: 'created-from-sdk',
      description: 'this is a description',
    })

    console.log(data)
    console.log(error)
  })
})
