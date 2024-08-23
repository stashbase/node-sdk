import { assert, test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Load specific env with env token and inject the variables into the process', async () => {
  const envApi = createEnvApi(process.env.VITE_TEST_ENV_API_KEY as string)

  await envApi.load({
    print: 'key-value',
  })

  console.log(process.env.DB_URL)
})
