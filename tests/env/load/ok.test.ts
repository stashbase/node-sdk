import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Load specific env with env token and inject the variables into the process', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  await client.environment.load({
    printSecrets: 'masked',
  })

  console.log(process.env.DB_URL)
})
