import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('deletes environment secret by name', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.delete(['NAME'])
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('deletedCount: ', data?.deletedCount)
    console.log('notFoundSecrets: ', data?.notFoundSecrets)
  }
})
