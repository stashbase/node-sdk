// tests/projects.test.ts
import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'

test('list projects', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.projects.list()

  console.log(data)
  console.log(error)
})
