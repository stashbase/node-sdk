import { assert, describe, test, vi, afterEach } from 'vitest'
import { createEnvironmentClient, createWorkspaceClient } from '../../../src'

const successResponse = () =>
  new Response(JSON.stringify([]), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })

describe('webhooks.list', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('workspace client forwards sort and order query params', async () => {
    const beforeRequest = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue(successResponse())
    vi.stubGlobal('fetch', fetchMock)

    const client = createWorkspaceClient('test-key', { hooks: { beforeRequest } })

    await client
      .webhooks({
        project: 'proj_9Ve7ijuUMuwh9fb1j7CyBq',
        environment: 'env_2vKmcBluEENNfFKtXzrHBS',
      })
      .list({ sortBy: 'updatedAt', order: 'asc' })

    assert.equal(fetchMock.mock.calls.length, 1)
    assert.deepEqual(beforeRequest.mock.calls[0][0].query, {
      sort_by: 'updated_at',
      order: 'asc',
    })
  })

  test('environment client forwards sort and order query params', async () => {
    const beforeRequest = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue(successResponse())
    vi.stubGlobal('fetch', fetchMock)

    const client = createEnvironmentClient('test-key', { hooks: { beforeRequest } })

    await client.webhooks.list({ sortBy: 'enabled', order: 'desc' })

    assert.equal(fetchMock.mock.calls.length, 1)
    assert.deepEqual(beforeRequest.mock.calls[0][0].query, {
      sort_by: 'enabled',
      order: 'desc',
    })
  })

  test('workspace client preserves default server ordering when no options are provided', async () => {
    const beforeRequest = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue(successResponse())
    vi.stubGlobal('fetch', fetchMock)

    const client = createWorkspaceClient('test-key', { hooks: { beforeRequest } })

    await client
      .webhooks({
        project: 'proj_9Ve7ijuUMuwh9fb1j7CyBq',
        environment: 'env_2vKmcBluEENNfFKtXzrHBS',
      })
      .list()

    assert.equal(fetchMock.mock.calls.length, 1)
    assert.equal(beforeRequest.mock.calls[0][0].query, undefined)
  })

  test('environment client rejects invalid sort values before sending a request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(successResponse())
    vi.stubGlobal('fetch', fetchMock)

    const client = createEnvironmentClient('test-key')
    const response = await client.webhooks.list({ sortBy: 'invalid' as never })

    assert.equal(response.error?.code, 'validation.invalid_sort_by')
    assert.equal(fetchMock.mock.calls.length, 0)
  })
})
