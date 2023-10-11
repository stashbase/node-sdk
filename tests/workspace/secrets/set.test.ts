import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Set secrets', () => {
  test('', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.set({
      project: '123',
      environment: 'test',
      data: [
        {
          key: 'KEYS',
          value: '',
        },
        {
          key: 'SECRET',
          value: '',
        },
      ],
    })

    console.log(data)
    console.log(error)
  })
})
