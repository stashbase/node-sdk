import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Update  environment type', () => {
  test('', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.updateType({
      project: 'hero-hub',
      name: 'dev-sdk',
      type: 'STAGING',
    })

    console.log(data)
    console.log(error)
  })
})
