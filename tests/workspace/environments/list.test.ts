import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List environments in a project', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.list({
      project: 'hero-hub',
    })

    console.log(data)
    console.log(error?.code)
  })
})
