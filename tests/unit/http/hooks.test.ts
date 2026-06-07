import { assert, describe, test, vi } from 'vitest'
import { createHttpClient, DEFAULT_API_BASE_URL } from '../../../src/http/client'

const expectedBaseUrl = process.env.STASHBASE_SDK_DEV_API_URL ?? DEFAULT_API_BASE_URL

describe('HttpClient hooks', () => {
  test('calls beforeRequest and afterResponse on successful request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { ok: true } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const beforeRequest = vi.fn()
    const afterResponse = vi.fn()

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: { beforeRequest, afterResponse },
    })

    const response = await client.sendApiRequest({
      method: 'POST',
      path: '/v1/test',
      data: { someValue: 'x' },
    })

    assert.equal(response.error, null)
    assert.equal(response.status, 200)
    assert.equal(beforeRequest.mock.calls.length, 1)
    assert.equal(afterResponse.mock.calls.length, 1)

    const beforeContext = beforeRequest.mock.calls[0][0] as {
      method: string
      path: string
      url: string
      data?: Record<string, unknown>
    }
    assert.equal(beforeContext.method, 'POST')
    assert.equal(beforeContext.path, '/v1/test')
    assert.equal(beforeContext.url, `${expectedBaseUrl}/v1/test`)
    assert.deepEqual(beforeContext.data, { some_value: 'x' })
  })

  test('calls afterResponse and onError when response is non-2xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'auth.unauthorized',
              message: 'Unauthorized',
              details: {},
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    )

    const afterResponse = vi.fn()
    const onError = vi.fn()

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: { afterResponse, onError },
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.notEqual(response.error, null)
    assert.equal(response.status, 401)
    assert.equal(afterResponse.mock.calls.length, 1)
    assert.equal(onError.mock.calls.length, 1)

    const errorContext = onError.mock.calls[0][0] as {
      method: string
      path: string
      error?: { error?: { code?: string } }
    }
    assert.equal(errorContext.method, 'GET')
    assert.equal(errorContext.path, '/v1/whoami')
    assert.equal(errorContext.error?.error?.code, 'auth.unauthorized')
  })

  test('calls onError when fetch throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        throw new Error('network failure')
      })
    )

    const onError = vi.fn()

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: { onError },
      retries: 1,
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.notEqual(response.error, null)
    assert.equal(response.status, null)
    assert.equal(onError.mock.calls.length, 1)

    const errorContext = onError.mock.calls[0][0] as {
      error?: Error
    }
    assert.equal(errorContext.error?.message, 'network failure')
  })

  test('maps hook failures to server.connection_failed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { ok: true } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: {
        beforeRequest: () => {
          throw new Error('boom-before')
        },
      },
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.error?.code, 'server.connection_failed')
    assert.equal(response.status, null)
  })

  test('ignores errors thrown by onError hook and preserves original request error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        throw new Error('network failure')
      })
    )

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: {
        onError: () => {
          throw new Error('boom-on-error')
        },
      },
      retries: 1,
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.error?.code, 'server.connection_failed')
    assert.equal(response.status, null)
  })

  test('calls beforeRequest and afterResponse for each retry attempt', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              error: {
                code: 'server.internal_error',
                message: 'Internal Server Error',
              },
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ data: { ok: true } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        )
    )

    const beforeRequest = vi.fn()
    const afterResponse = vi.fn()

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: { beforeRequest, afterResponse },
      retries: 2,
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.error, null)
    assert.equal(response.status, 200)
    assert.equal(beforeRequest.mock.calls.length, 2)
    assert.equal(afterResponse.mock.calls.length, 2)
    assert.equal(afterResponse.mock.calls[0][0].response.status, 500)
    assert.equal(afterResponse.mock.calls[1][0].response.status, 200)
  })
})
