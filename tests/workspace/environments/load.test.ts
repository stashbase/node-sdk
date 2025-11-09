import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Should load environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { error } = await client
    .environments({ project: 'proj_nVpZPsL5nQTUP9yXU2GKYJ' })
    .load('development', {
      printSecrets: 'masked',
      expandRefs: true,
    })

  console.log(error)
})
