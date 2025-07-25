import { assert, test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Load specific env with env token and inject the variables into the process', async () => {
  const client = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  await client.load({
    print: 'name-value',
  })

  console.log(process.env.DB_URL)
})
