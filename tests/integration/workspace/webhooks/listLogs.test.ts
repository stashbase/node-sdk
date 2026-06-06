import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('List webhook logs', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client
    .webhooks({ project: workspaceTestConfig.project, environment: workspaceTestConfig.environment })
    .listLogs(workspaceTestConfig.webhookId, {
      page: 1,
      pageSize: 20,
    })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
