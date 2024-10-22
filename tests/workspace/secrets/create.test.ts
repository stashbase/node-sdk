import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Create secrets', () => {
  test('OK', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.secrets('hero-hub', 'vercel').create([
      {
        name: 'SOME_KEY',
        value: 'SOME_VALUE',
      },
    ])

    console.log(data)
    console.log(error)

    if (error) {
      const err = error

      if (err.isRateLimitError()) {
        const e = err.code === 'rate_limit.too_many_requests'

        if (e) {
          const d = err.details.retryAfter.seconds
        }
      }
    }
  })
})
