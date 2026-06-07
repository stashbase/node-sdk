import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('WorkspaceClient.withContext', () => {
  test('creates a project-scoped context', () => {
    const client = createWorkspaceClient('test-key')
    const context = client.withContext({ project: 'my-project' })

    assert.equal(context.scope, 'workspace')
    assert.equal(context.project, 'my-project')
    assert.equal(context.environments.project, 'my-project')
  })

  test('creates an environment-scoped context directly', () => {
    const client = createWorkspaceClient('test-key')
    const context = client.withContext({
      project: 'my-project',
      environment: 'dev',
    })

    assert.equal(context.scope, 'workspace')
    assert.equal(context.project, 'my-project')
    assert.equal(context.environment, 'dev')
    assert.equal(context.secrets.project, 'my-project')
    assert.equal(context.secrets.environment, 'dev')
    assert.equal(context.webhooks.project, 'my-project')
    assert.equal(context.webhooks.environment, 'dev')
  })

  test('creates an environment-scoped context via inEnvironment helper', () => {
    const client = createWorkspaceClient('test-key')
    const projectContext = client.withContext({ project: 'my-project' })
    const context = projectContext.inEnvironment('staging')

    assert.equal(context.project, 'my-project')
    assert.equal(context.environment, 'staging')
    assert.equal(context.secrets.project, 'my-project')
    assert.equal(context.secrets.environment, 'staging')
    assert.equal(context.webhooks.project, 'my-project')
    assert.equal(context.webhooks.environment, 'staging')
  })
})
