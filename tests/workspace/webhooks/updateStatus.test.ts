import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Disable webhook', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.webhooks('name', '123').disable('whk_4i1gbnewYBnCTZg3Sbye2c')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
