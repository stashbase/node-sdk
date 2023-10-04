import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create environment', () => {
  test('', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.create({
      project: 'hero-hub',
      name: 'dev-sdk',
      type: 'DEVELOPMENT',
    })

    console.log(data)
    console.log(error)
  })
})
