import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Set secrets (add new or update existing)', async () => {
  const envApi = createEnvApi(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await envApi.secrets.setMany([
    {
      key: 'SECRET',
      value: 'VALUE_123',
      description: null,
    },
    {
      key: 'APPP_URL',
      value: 'https://sss',
    },
  ])
  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  }
})
