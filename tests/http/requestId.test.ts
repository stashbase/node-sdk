import { assert, describe, test, vi } from 'vitest'
import { createHttpClient } from '../../src/http/client'

describe('ApiError requestId passthrough', () => {
  test('maps requestId from error payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        return new Response(
          JSON.stringify({
            error: {
              code: 'auth.unauthorized',
              details: {},
              message: 'Unauthorized',
              request_id: 'req_123',
            },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.ok, false)

    if (!response.ok) {
      assert.equal((response.error as { code?: string }).code, 'auth.unauthorized')
      assert.equal((response.error as { requestId?: string }).requestId, 'req_123')
    }
  })

  test('maps requestId from error details payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        return new Response(
          JSON.stringify({
            error: {
              code: 'server.internal_error',
              details: {
                request_id: 'req_456',
              },
              message: 'Internal Server Error',
            },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.ok, false)

    if (!response.ok) {
      assert.equal((response.error as { code?: string }).code, 'server.internal_error')
      assert.equal((response.error as { requestId?: string }).requestId, 'req_456')
    }
  })
})
