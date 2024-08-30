import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Rotate webhook signing secret', async () => {
  const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await stashbase.webhooks.rotateSigningSecret({
    project: 'name',
    environment: '123',
    webhookId: 'wh_4i1gbnewYBnCTZg3Sbye2c',
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
