import { assert, describe, test, vi } from 'vitest'
import { createClient } from '../../src'

describe('createClient', () => {
  test('returns environment client for environment scope', () => {
    const client = createClient({ apiKey: 'test-key', scope: 'environment' })
    assert.equal(client.scope, 'environment')
  })

  test('returns workspace client for workspace scope', () => {
    const client = createClient({ apiKey: 'test-key', scope: 'workspace' })
    assert.equal(client.scope, 'workspace')
  })

  test('does not call fetch during client creation', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    createClient({ apiKey: 'test-key', scope: 'workspace' })
    createClient({ apiKey: 'test-key', scope: 'environment' })

    assert.equal(fetchMock.mock.calls.length, 0)
  })
})
