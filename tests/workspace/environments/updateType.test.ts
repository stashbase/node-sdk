import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Update  environment type', () => {
  test('', async () => {
    const stashbase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.environments.updateType({
      project: 'hero-hub',
      name: 'dev-sdk',
      type: 'STAGING',
    })

    console.log(data)
    console.log(error)
  })
})
