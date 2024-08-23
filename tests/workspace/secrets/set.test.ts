import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Set secrets', () => {
  test('', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.set({
      project: 'pr_iBgCx5tegfVaKzjywTg2ck',
      environment: 'ev_3NCdY7kmbLJpZcpMg4W6wk',
      data: [
        {
          key: 'KEYS',
          value: '123',
        },
        {
          key: 'SECRET_234',
          value: 'SECRET_234',
        },
      ],
    })

    console.log(data)
    console.log(error)

    if (error?.code?.startsWith('validation')) {
      console.log(`Validation error: `, error.message)
    }
  })
})
