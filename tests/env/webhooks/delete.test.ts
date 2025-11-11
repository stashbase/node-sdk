import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Get get single webhook', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await client.webhooks.delete('whk_52chU9rxhMQqBjift4zhF4')

  if (error) {
    const { code } = error
    console.log(code)

    if (error.isResourceError()) {
      console.log('Webhook not found')
    }
  } else {
    console.log('Data:\n')
  }
})
