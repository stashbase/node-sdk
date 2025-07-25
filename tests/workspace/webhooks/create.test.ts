import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Create webhook', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.webhooks('name', '123').create({
    enabled: true,
    url: 'https://very-last-url.com',
    description: 'Very last description',
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
