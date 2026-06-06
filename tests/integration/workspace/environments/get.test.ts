import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('gets environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
  const { data, error } = await client
    .environments({ project: workspaceTestConfig.project })
    .get(workspaceTestConfig.environment)

  console.log(data)
  console.log(error)
})
