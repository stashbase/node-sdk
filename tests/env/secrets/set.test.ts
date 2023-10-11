import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Set secrets (add new or update existing)', async () => {
  const envApi = createEnvApi('V46rWNY1zh1NO2mFrtVqOnwlY4RTXti-')

  const { error } = await envApi.secrets.set([
    {
      key: 'SECRET',
      value: 'VALUE_123',
    },
    {
      key: 'AP_URL',
      value: 'https://',
    },
  ])
  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  }
})
