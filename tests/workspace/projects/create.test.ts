// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create project', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.projects.create({
      name: 'created-from-sdk',
      description: 'this is a description',
    })

    console.log(data)
    console.log(error)
  })
})
