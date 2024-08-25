// tests/projects.test.ts
import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Create project', () => {
  test('OK', async () => {
    const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.projects.create({
      name: 'created-from-sdk',
      description: 'this is a description',
    })

    console.log(data)
    console.log(error)
  })
})
