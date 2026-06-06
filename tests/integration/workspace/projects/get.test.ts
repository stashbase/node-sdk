// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('gets project', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
  const { data } = await client.projects.get(workspaceTestConfig.project)

  assert.notEqual(data, null)
  assert.exists(data?.name)
  assert.exists(data?.createdAt)
  assert.exists(data?.description)
})
