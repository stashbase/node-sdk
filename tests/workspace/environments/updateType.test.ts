import { describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Update  environment type', () => {
  test('', async () => {
    const stashbase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)
    const { data, error } = await stashbase.environments('hero-hub').updateType('dev-sdk', 'STAGING')

    console.log(data)
    console.log(error)
  })
})
