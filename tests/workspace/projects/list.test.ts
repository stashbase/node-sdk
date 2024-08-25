// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List projects', () => {
  test('OK', async () => {
    const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.projects.list()

    console.log(data)
    console.log(error)
  })

  //   test('not found', async () => {
  //     const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')
  //
  //     const { data, error } = await envEase.projects.get('hero-hub33')
  //
  //     assert.equal(data, null)
  //     assert.equal(error?.code, 'project_not_found')
  //   })
  //
  //   test('invalid token', async () => {
  //     const envEase = createEnvEase('1234')
  //
  //     const { data, error } = await envEase.projects.get('hero-hub')
  //     console.log(error)
  //
  //     assert.equal(data, null)
  //     assert.equal(error?.code, 'invalid_token')
  //   })
})
