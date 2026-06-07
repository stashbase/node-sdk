import { assert, describe, test, vi } from 'vitest'
import { createHttpClient } from '../../../src/http/client'

describe('HttpClient timeout/abort support', () => {
  test('uses the SDK default timeout when none is configured', async () => {
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
    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      hooks: { beforeRequest },
    })

    await client.sendApiRequest({ method: 'GET', path: '/v1/default-timeout' })

    assert.equal(beforeRequest.mock.calls[0][0].timeoutMs, 5000)
  })

  test('caps configured timeout at the SDK maximum', async () => {
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
    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      timeoutMs: 15000,
      hooks: { beforeRequest },
    })

    await client.sendApiRequest({ method: 'GET', path: '/v1/timeout-cap' })

    assert.equal(beforeRequest.mock.calls[0][0].timeoutMs, 10000)
  })

  test('aborts request when timeout is reached', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal as AbortSignal | undefined
        signal?.addEventListener('abort', () => {
          const error = new Error('aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      timeoutMs: 20,
    })

    const response = await client.sendApiRequest({ method: 'GET', path: '/v1/timeout' })

    assert.equal(response.error?.code, 'server.connection_failed')
    assert.equal(response.status, null)
    assert.equal(fetchMock.mock.calls.length, 1)
  })

  test('aborts request when signal is aborted', async () => {
    const fetchMock = vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal as AbortSignal | undefined
        signal?.addEventListener('abort', () => {
          const error = new Error('aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    })

    vi.stubGlobal('fetch', fetchMock)

    const controller = new AbortController()
    setTimeout(() => controller.abort(), 10)

    const client = createHttpClient({
      authorization: { apiKey: 'test-key' },
      timeoutMs: 1000,
    })

    const response = await client.sendApiRequest({
      method: 'GET',
      path: '/v1/abort',
      signal: controller.signal,
    })

    assert.equal(response.error?.code, 'server.connection_failed')
    assert.equal(response.status, null)
    assert.equal(fetchMock.mock.calls.length, 1)
  })
})
