// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../src'

test('Get specific env with env token and return variables with name', async () => {
  const envApi = createEnvApi(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.get()

  assert.equal(error, null)

  if (data) {
    console.log(data.project)
  }
})
