import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Should load environment', async () => {
  const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { error } = await envEase.environments('pr_nVpZPsL5nQTUP9yXU2GKYJ').load('123', {
    print: 'key',
    expandRefs: true,
  })

  console.log(error)
})
