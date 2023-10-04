import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create secrets', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.create({
      project: 'hero-hub',
      name: 'vercel',
      data: [
        {
          key: 'SOME_KEY',
          value: 'SOME_VALUE',
        },
      ],
    })

    console.log(data)
    console.log(error)
  })
})
