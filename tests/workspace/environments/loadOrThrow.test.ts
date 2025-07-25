import { test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

test('Should load environment or throw an error', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  try {
    await client.environments('stashbase').loadOrThrow('webhooks-testing')
  } catch (error) {
    console.log(error)
  }
})
