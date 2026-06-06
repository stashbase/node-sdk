import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('enables environment webhook', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.enable(environmentTestConfig.webhookId)

  if (error) {
    const { code } = error
    console.log(code)
  }
})
