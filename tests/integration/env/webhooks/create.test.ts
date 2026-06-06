import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('Create webhook', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.create({
    url: environmentTestConfig.webhookUrl,
    enabled: true,
  })

  if (error) {
    console.log(error)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
