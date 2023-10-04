import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Rename environment', () => {
  test('', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.rename({
      project: 'hero-hub',
      name: 'dev-sdk',
      newName: 'flynta',
    })

    console.log(data)
    console.log(error)
  })
})
