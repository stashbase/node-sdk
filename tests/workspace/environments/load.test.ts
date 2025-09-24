import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Should load environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { error } = await client.environments('proj_nVpZPsL5nQTUP9yXU2GKYJ').load('123', {
    printSecrets: 'name',
    expandRefs: true,
  })

  console.log(error)
})
