import { assert, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'
import { ApiError } from '../../../src/http/response'

test('Should load environment or throw an error', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  let caught: unknown

  try {
    await client.environments({ project: 'stashbase' }).loadOrThrow('webhooks-testing')
  } catch (error) {
    caught = error
  }

  assert.notEqual(caught, undefined)
  assert.equal(caught instanceof ApiError, true)

  if (caught instanceof ApiError) {
    assert.equal(typeof caught.code, 'string')
    assert.notEqual(caught.code.length, 0)
  }
})
