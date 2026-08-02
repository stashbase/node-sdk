import { assert, describe, test, vi } from 'vitest'
import { createEnvironmentClient, createWorkspaceClient } from '../../../src'

describe('client request options', () => {
  test('applies timeout and cancellation options to a scoped workspace request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { scope: 'workspace' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const controller = new AbortController()
    const beforeRequest = vi.fn()
    const client = createWorkspaceClient('test-api-key', { hooks: { beforeRequest } })

    await client.withRequestOptions({ signal: controller.signal, timeoutMs: 20 }).whoami()

    assert.equal(beforeRequest.mock.calls[0][0].signal, controller.signal)
    assert.equal(beforeRequest.mock.calls[0][0].timeoutMs, 20)
  })

  test('does not mutate the original environment client request options', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { scope: 'environment' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const beforeRequest = vi.fn()
    const client = createEnvironmentClient('test-api-key', { hooks: { beforeRequest } })

    await client.withRequestOptions({ timeoutMs: 20 }).whoami()
    await client.whoami()

    assert.equal(beforeRequest.mock.calls[0][0].timeoutMs, 20)
    assert.equal(beforeRequest.mock.calls[1][0].timeoutMs, 5000)
  })
})
