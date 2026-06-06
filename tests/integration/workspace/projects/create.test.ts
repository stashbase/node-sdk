// tests/projects.test.ts
import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('creates project', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.projects.create({
    name: workspaceTestConfig.project,
  })

  console.log(data)
  console.log(error)
})
