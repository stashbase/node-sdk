import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('List environments in a project', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await client.environments('hero-hub').list()

    console.log(data)
    console.log(error?.code)
  })
})
