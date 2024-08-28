import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Duplicate environment', () => {
  test('', async () => {
    const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { error } = await stashbase.environments.duplicate({
      project: 'hero-hub',
      environment: 'aws',
      duplicateName: 'aws_copy',
    })

    console.log(error)
  })
})
