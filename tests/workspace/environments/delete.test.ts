import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Delete environment', () => {
  test('Invalid token', async () => {
    const envEase = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase
      .environments('proj_nVpZPsL5nQTUP9yXU2GKYJ')
      .delete('app-dev')

    console.log(data)
    console.log(error)
  })

  test('Project not found', async () => {
    const envEase = createWorkspaceClient('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')
    const { data, error } = await envEase.environments('hero-hub1231231231').delete('dev-sdk')

    assert.equal(error?.code, 'project_not_found')

    console.log(data)
    console.log(error)
  })
})
