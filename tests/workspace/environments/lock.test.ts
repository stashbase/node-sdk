import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Lock/unlock environment', () => {
  test('Lock', async () => {
    console.log('lock test')
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.lock({
      project: 'hero-hub',
      name: 'dev-sdk',
    })

    console.log(data)
    console.log(error)
  })

  test('Unlock', async () => {
    console.log('unlock test')

    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.unlock({
      project: 'hero-hub',
      name: 'dev-sdk',
    })

    console.log(data)
    console.log(error)
  })
})
