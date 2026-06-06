import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'

test('Get environment', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
  const { data, error } = await client.environments({ project: 'hero-hub' }).get('vercel')

  if (error?.code === 'rate_limit.too_many_requests') {
    console.log(true)
  }

  console.log(data)
  console.log(error)
})
