import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Set secrets (add new or update existing)', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await client.secrets.set([
    {
      name: 'SECRET',
      value: 'VALUE_123',
      comment: null,
    },
    {
      name: 'APPP_URL',
      value: 'https://sss',
    },
  ])
  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  }
})
