// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Delete project', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.projects.remove(['created-from-sdk'])

    console.log(data)
    console.log(error)
  })
})
