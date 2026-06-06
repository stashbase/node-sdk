// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../../src'
import { workspaceTestConfig } from '../workspaceTestConfig'

describe('Get single project', () => {
  test('gets project', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data } = await client.projects.get(workspaceTestConfig.project)

    assert.notEqual(data, null)
    assert.exists(data?.name)
    assert.exists(data?.createdAt)
    assert.exists(data?.description)

    if (data) {
      console.log(data)
    }
  })

  test('returns project not found for missing project', async () => {
    const client = createWorkspaceClient('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await client.projects.get(workspaceTestConfig.missingProject)

    assert.equal(data, null)
    assert.equal(error?.code, 'project_not_found')
  })

  test('returns unauthorized for invalid workspace api key', async () => {
    const client = createWorkspaceClient('1234')

    const { data, error } = await client.projects.get(workspaceTestConfig.project)
    console.log(error)

    assert.equal(data, null)
    assert.equal(error?.code, 'unauthorized')
  })
})
