import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Rename environment', () => {
  test('', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await client.environments('hero-hub').rename('dev-sdk', 'flynta')

    console.log(data)
    console.log(error)
  })
})
