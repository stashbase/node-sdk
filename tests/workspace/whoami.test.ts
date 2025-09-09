// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createWorkspaceClient } from '../../src'

test('Get current authed entity details', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.whoami()

  console.log(data)
  console.log(error)

  if (data) {
    const isUser = data.type === 'user'

    if (isUser) {
      console.log('User')
      console.log(data.data)
    } else if (data.type === 'environment_account') {
      console.log('Environment account')
      console.log(data.data)
    } else if (data.type === 'service_account') {
      console.log('Service account')
      console.log(data.data)
    }
  }
})
