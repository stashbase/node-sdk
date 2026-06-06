// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('returns environment details with environment api key', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.environment.get()

  assert.equal(error, null)

  if (data) {
    console.log(data.project)
  }
})
