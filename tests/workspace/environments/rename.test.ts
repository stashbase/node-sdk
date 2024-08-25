import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Rename environment', () => {
  test('', async () => {
    const stashbase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { data, error } = await envEase.environments.rename({
      project: 'hero-hub',
      name: 'dev-sdk',
      newName: 'flynta',
    })

    console.log(data)
    console.log(error)
  })
})
