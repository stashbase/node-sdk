import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Get secret', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client
      .secrets({ project: 'hero-hub', environment: 'vercel' })
      .get('SOME_KEY')

    console.log(data)
    console.log(error)
  })
})
