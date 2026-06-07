import { assert, describe, test, vi } from 'vitest'
import { createEnvironmentClient, createWorkspaceClient } from '../../../src'

describe('client.options.hooks', () => {
  test('workspace client exposes hooks in options and allows runtime update', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: { scope: 'workspace' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )

    const beforeRequest = vi.fn()
    const client = createWorkspaceClient('test-api-key')

    assert.equal(client.options.hooks, undefined)

    client.options.hooks = { beforeRequest }
    assert.equal(client.options.hooks?.beforeRequest, beforeRequest)

    await client.whoami()
    assert.equal(beforeRequest.mock.calls.length, 1)
  })

  test('environment client exposes hooks in options and allows runtime update', async () => {
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
    const client = createEnvironmentClient('test-api-key')

    assert.equal(client.options.hooks, undefined)

    client.options.hooks = { beforeRequest }
    assert.equal(client.options.hooks?.beforeRequest, beforeRequest)

    await client.whoami()
    assert.equal(beforeRequest.mock.calls.length, 1)
  })
})
