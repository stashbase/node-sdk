import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

describe('Create secrets', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await client
      .secrets({
        project: workspaceTestConfig.project,
        environment: workspaceTestConfig.environment,
      })
      .create([
        {
          name: 'NAME',
          value: 'value',
        },
      ])

    console.log(data)
    console.log(error)

    if (error?.code === 'rate_limit.too_many_requests') {
      const details = error.details as { retryAfter?: { seconds?: number } } | undefined
      console.log(details?.retryAfter?.seconds)
    }
  })
})
