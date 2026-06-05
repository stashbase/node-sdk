import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Get webhook log', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks({ project: 'name', environment: 'api-dev' })
    .getLog('whk_4i1gbnewYBnCTZg3Sbye2c', 'whlog_m1DAScGeaJfFLSFUzTjiq8')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
