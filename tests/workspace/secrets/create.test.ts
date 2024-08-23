import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create secrets', () => {
  test('OK', async () => {
    const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.secrets.create({
      project: 'hero-hub',
      environment: 'vercel',
      data: [
        {
          key: 'SOME_KEY',
          value: 'SOME_VALUE',
        },
      ],
    })

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
