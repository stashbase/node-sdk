import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('List environments in a project', () => {
  test('OK', async () => {
    const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.environments.list({
      project: 'hero-hub',
    })

    console.log(data)
    console.log(error?.code)
  })
})
