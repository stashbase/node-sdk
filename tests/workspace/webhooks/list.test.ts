import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('List webhooks', async () => {
  const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await stashbase.webhooks.list({
    project: 'name',
    environment: '123',
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
