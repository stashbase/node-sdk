import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Get signgle secret by key', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.get('NEW_KEY')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
