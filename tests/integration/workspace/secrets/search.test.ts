import { test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

test('searches secrets', async () => {
  const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error } = await client.searchSecrets({
    project: workspaceTestConfig.project,
    name: 'NAME',
    includeValue: true,
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else if (data) {
    for (const item of data) {
      if ('secretValue' in item) {
        console.log(
          `Secret name: ${item.environments.map((env) => env.name).join(', ')}, Secret value: ${item.secretValue}`
        )
      } else {
        console.log(
          `Secret name: ${item.secretName}, Environments: ${item.environments.map((env) => env.name).join(', ')}`
        )
      }
    }
  }
})
