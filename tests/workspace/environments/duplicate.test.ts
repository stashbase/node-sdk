import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Duplicate environment', () => {
  test('', async () => {
    const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { error } = await stashbase.environments('hero-hub').duplicate('aws', 'aws-copy')

    console.log(error)
  })
})
