import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('lists secrets', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .secrets({
      project: workspaceTestConfig.project,
      environment: workspaceTestConfig.environment,
    })
    .listOnly(['SECRET_1', 'SECRET_2'])

  console.log(data)
  console.log(error)
})
