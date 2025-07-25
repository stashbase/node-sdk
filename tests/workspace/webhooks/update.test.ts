import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Update webhook', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks('name', '123')
    .update('whk_4i1gbnewYBnCTZg3Sbye2c', {
      description: 'This is a new description for the webhook',
    })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
