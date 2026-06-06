import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

describe('Update environment', () => {
  test('', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client
      .environments({ project: workspaceTestConfig.project })
      .update(workspaceTestConfig.environment, {
        isProduction: false,
      })

    console.log(data)
    console.log(error)
  })
})
