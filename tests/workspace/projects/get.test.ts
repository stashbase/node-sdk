// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createWorkspaceClient } from '../../../src'

describe('Get single project', () => {
  test('OK', async () => {
    const client = createWorkspaceClient(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data } = await client.projects.get('hero-hub')

    assert.notEqual(data, null)
    assert.exists(data?.name)
    assert.exists(data?.createdAt)
    assert.exists(data?.description)

    if (data) {
      console.log(data)
    }
  })

  test('not found', async () => {
    const client = createWorkspaceClient('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

    const { data, error } = await client.projects.get('hero-hub33')

    assert.equal(data, null)
    assert.equal(error?.code, 'project_not_found')
  })

  test('invalid token', async () => {
    const client = createWorkspaceClient('1234')

    const { data, error } = await client.projects.get('hero-hub')
    console.log(error)

    assert.equal(data, null)
    assert.equal(error?.code, 'unauthorized')
  })
})
