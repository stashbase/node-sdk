import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Create environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .environments({ project: 'proj_nVpZPsL5nQTUP9yXU2GKYJ' })
    .create({
      name: 'app-dev',
      isProduction: false,
    })

  console.log(data)
  console.log(error)

  if (error?.code === 'conflict.environment_already_exists') {
    console.log('Is conflictError')
  }
})
