import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Get environment', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.get(
      {
        project: 'hero-hub',
        environment: 'vercel',
      },
      {
        secrets: true,
      }
    )

    console.log(data)
    console.log(error)
  })
})
