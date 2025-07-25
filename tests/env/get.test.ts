// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvClient } from '../../src'

test('Get specific env with env token and return variables with name', async () => {
  const client = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.get()

  assert.equal(error, null)

  if (data) {
    console.log(data.project)
  }
})
