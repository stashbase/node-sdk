import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('gets secret', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .secrets({
      project: workspaceTestConfig.project,
      environment: workspaceTestConfig.environment,
    })
    .get('NAME')

  console.log(data)
  console.log(error)
})
