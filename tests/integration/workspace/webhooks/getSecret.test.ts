import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('gets webhook signing secret', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks({
      project: workspaceTestConfig.project,
      environment: workspaceTestConfig.environment,
    })
    .getSigningSecret(workspaceTestConfig.webhookId)

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
