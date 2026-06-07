import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('loads authenticated environment secrets into process.env', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  await client.environment.load({
    printSecrets: 'masked',
  })
})
