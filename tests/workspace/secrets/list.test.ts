import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List secrets', () => {
  test('OK', async () => {
    const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.secrets.list({
      project: 'pr_iBgCx5tegfVaKzjywTg2ck',
      environment: 'ev_3NCdY7kmbLJpZcpMg4W6wk',
    })

    console.log(data)
    console.log(error)
  })
})
