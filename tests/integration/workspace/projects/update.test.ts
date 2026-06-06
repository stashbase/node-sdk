// tests/projects.test.ts
import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

describe('Update project', () => {
  test('updates project', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client.projects.update(workspaceTestConfig.project, {
      description: null,
    })

    console.log(data)
  })
})
