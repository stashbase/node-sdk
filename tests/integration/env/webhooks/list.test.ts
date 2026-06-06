import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('lists environment webhooks', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.list()

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
