import { assert, describe, test, vi } from 'vitest'
import { createHttpClient, HookExecutionError } from '../../src/http/client'

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

    assert.equal(response.ok, true)
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
    assert.equal(beforeContext.url, 'https://api.stashbase.dev/v1/test')
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

    assert.equal(response.ok, false)
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

    assert.equal(response.ok, false)
    assert.equal(onError.mock.calls.length, 1)

    const errorContext = onError.mock.calls[0][0] as {
      error?: Error
    }
    assert.equal(errorContext.error?.message, 'network failure')
  })

  test('returns HookExecutionError when beforeRequest throws', async () => {
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

    assert.equal(response.ok, false)
    if (!response.ok) {
      assert.instanceOf(response.error, HookExecutionError)
      const error = response.error as HookExecutionError
      assert.equal(error.hook, 'beforeRequest')
      assert.equal((error.originalError as Error).message, 'boom-before')
    }
  })

  test('returns HookExecutionError when afterResponse throws', async () => {
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
        afterResponse: () => {
          throw new Error('boom-after')
        },
      },
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/whoami' })

    assert.equal(response.ok, false)
    if (!response.ok) {
      assert.instanceOf(response.error, HookExecutionError)
      const error = response.error as HookExecutionError
      assert.equal(error.hook, 'afterResponse')
      assert.equal((error.originalError as Error).message, 'boom-after')
    }
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

    assert.equal(response.ok, false)
    if (!response.ok) {
      const error = response.error as { code?: string }
      assert.equal(error.code, 'server.connection_failed')
    }
  })
})
