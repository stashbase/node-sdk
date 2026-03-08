import { assert, describe, test, vi } from 'vitest'
import { createHttpClient } from '../../src/http/client'

describe('HttpClient timeout/abort support', () => {
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

    assert.equal(response.ok, false)

    if (!response.ok) {
      assert.equal((response.error as { code?: string }).code, 'server.connection_failed')
    }

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

    assert.equal(response.ok, false)

    if (!response.ok) {
      assert.equal((response.error as { code?: string }).code, 'server.connection_failed')
    }

    assert.equal(fetchMock.mock.calls.length, 1)
  })
})
