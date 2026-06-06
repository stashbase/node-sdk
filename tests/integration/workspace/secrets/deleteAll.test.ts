import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('deletes all secrets', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .secrets({ project: workspaceTestConfig.project, environment: workspaceTestConfig.environment })
    .deleteAll()

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
