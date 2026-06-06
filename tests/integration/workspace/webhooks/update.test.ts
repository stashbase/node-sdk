import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('updates webhook', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks({
      project: workspaceTestConfig.project,
      environment: workspaceTestConfig.environment,
    })
    .update(workspaceTestConfig.webhookId, {
      description: 'This is a new description for the webhook',
    })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
