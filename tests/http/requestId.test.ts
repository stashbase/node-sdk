import { assert, describe, test, vi } from 'vitest'
import { createHttpClient } from '../../src/http/client'

describe('ApiError passthrough', () => {
  test('maps error code and message from payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        return new Response(
          JSON.stringify({
            error: {
              code: 'auth.unauthorized',
              details: {},
              message: 'Unauthorized',
            },
          }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )

    const client = createHttpClient({ authorization: { apiKey: 'test-key' } })
    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.error?.code, 'auth.unauthorized')
    assert.equal(response.error?.message, 'Unauthorized')
    assert.equal(response.status, 401)
  })

  test('keeps backend error code for server failures', async () => {
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

    const client = createHttpClient({ authorization: { apiKey: 'test-key' } })
    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.error?.code, 'server.internal_error')
    assert.equal(response.error?.message, 'Internal Server Error')
    assert.equal(response.status, 500)
  })
})
