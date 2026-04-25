import { assert, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Should load environment or throw an error', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  let caught: unknown

  try {
    await client.environments({ project: 'stashbase' }).loadOrThrow('webhooks-testing')
  } catch (error) {
    caught = error
  }

  assert.notEqual(caught, undefined)

  if (caught && typeof caught === 'object' && 'code' in caught) {
    const apiError = caught as { code: string }
    assert.equal(typeof apiError.code, 'string')
    assert.notEqual(apiError.code.length, 0)
  }
})
