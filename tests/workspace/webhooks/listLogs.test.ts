import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('List webhook logs', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks({ project: 'name', environment: '123' })
    .listLogs('whk_4i1gbnewYBnCTZg3Sbye2c', {
      page: 1,
      limit: 20,
    })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
