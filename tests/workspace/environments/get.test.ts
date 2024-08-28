import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Get environment', () => {
  test('OK', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.environments.get({
      project: 'hero-hub',
      environment: 'vercel',
    })

    const type = error?.getType()

    if (error) {
      if (error.isRateLimitError() === true) {
        console.log(error.code === 'rate_limit.too_many_requests')
      }
    }

    console.log(data)
    console.log(error)
  })
})
