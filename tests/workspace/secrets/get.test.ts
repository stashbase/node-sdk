import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Get secret', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.get({
      project: 'hero-hub',
      name: 'vercel',
      key: 'JWT_KEY',
    })

    console.log(data)
    console.log(error)
  })
})
