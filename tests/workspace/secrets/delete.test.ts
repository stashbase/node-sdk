import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createEnvEase(process.env.WORKSPACE_API_KEY as string)

  const { data, error } = await envEase.secrets.removeMany({
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
