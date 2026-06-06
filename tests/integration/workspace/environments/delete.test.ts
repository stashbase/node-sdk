import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

describe('Delete environment', () => {
  test('returns unauthorized for invalid workspace api key', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client
      .environments({ project: workspaceTestConfig.project })
      .delete(workspaceTestConfig.environment)

    console.log(data)
    console.log(error)
  })

  test('returns project not found for missing project', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await client
      .environments({ project: workspaceTestConfig.missingProject })
      .delete(workspaceTestConfig.missingEnvironment)

    assert.equal(error?.code, 'project_not_found')

    console.log(data)
    console.log(error)
  })
})
