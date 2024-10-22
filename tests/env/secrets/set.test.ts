import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Set secrets (add new or update existing)', async () => {
  const envApi = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await envApi.secrets.set([
    {
      name: 'SECRET',
      value: 'VALUE_123',
      description: null,
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
