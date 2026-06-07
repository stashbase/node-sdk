import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('deletes environment webhook by id', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await client.webhooks.delete(environmentTestConfig.webhookId)

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
  }
})
