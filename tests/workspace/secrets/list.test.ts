import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List secrets', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.list({
      project: 'hero-hub',
      environment: 'vercel',
      description: true,
    })

    console.log(data)
    console.log(error)
  })
})
