import { assert, test } from 'vitest'
import { createEnvironmentClient, createWorkspaceClient } from '../../src'

test('Workspace client exposes workspace scope', () => {
  const client = createWorkspaceClient('test-api-key')
  assert.equal(client.scope, 'workspace')
})

test('Environment client exposes environment scope', () => {
  const client = createEnvironmentClient('test-api-key')
  assert.equal(client.scope, 'environment')
})
