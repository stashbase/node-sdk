import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Delete environment', () => {
  test('Invalid token', async () => {
    const envEase = createWorkspaceClient('4r4')

    const { data, error } = await envEase.environments.delete({
      project: 'hero-hub1231231231',
      environment: 'dev-sdk',
    })

    console.log(data)
    console.log(error)

    assert.equal(error?.code, 'invalid_token')
  })

  test('Project not found', async () => {
    const envEase = createWorkspaceClient('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await envEase.environments.delete({
      project: 'hero-hub1231231231',
      environment: 'dev-sdk',
    })

    assert.equal(error?.code, 'project_not_found')

    console.log(data)
    console.log(error)
  })
})
