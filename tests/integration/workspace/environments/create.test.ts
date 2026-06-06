import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('Create environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .environments({ project: workspaceTestConfig.project })
    .create({
      name: workspaceTestConfig.environment,
      isProduction: false,
    })

  console.log(data)
  console.log(error)

  if (error?.code === 'conflict.environment_already_exists') {
    console.log('Is conflictError')
  }
})
