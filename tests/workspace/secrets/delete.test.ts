import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

  const { data, error } = await envEase.secrets.remove({
    project: 'pr_iBgCx5tegfVaKzjywTg2ck',
    environment: 'ev_3NCdY7kmbLJpZcpMg4W6wk',
    keys: ['KEYS', 'SECRET_234'],
  })
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
