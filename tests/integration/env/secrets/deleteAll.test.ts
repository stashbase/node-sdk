import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('deletes all environment secrets', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.deleteAll()
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
