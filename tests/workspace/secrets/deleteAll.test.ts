import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Delete secrets', async () => {
  const client = createWorkspaceClient(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await client.secrets('name', '123').deleteAll()
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
