import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('lists environments', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
  const { data, error } = await client.environments({ project: workspaceTestConfig.project }).list()

  console.log(data)
  console.log(error?.code)
})
