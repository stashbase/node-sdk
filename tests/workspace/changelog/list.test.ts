import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('List changes', async () => {
  const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await stashbase.changelog('test', 'api-dev').list()

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
