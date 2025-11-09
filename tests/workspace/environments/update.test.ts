import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Update environment', () => {
  test('', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client.environments({ project: 'hero-hub' }).update('api-dev', {
      name: 'api-development',
      isProduction: false,
    })

    console.log(data)
    console.log(error)
  })
})
