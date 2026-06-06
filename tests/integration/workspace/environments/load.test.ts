import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('loads environment secrets into process.env', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { error } = await client
    .environments({ project: workspaceTestConfig.project })
    .load(workspaceTestConfig.environment, {
      printSecrets: 'masked',
      expandRefs: true,
    })

  console.log(error)
})
