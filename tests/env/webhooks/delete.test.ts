import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Get get single webhook', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await stashbase.webhooks.delete('wh_52chU9rxhMQqBjift4zhF4')

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
