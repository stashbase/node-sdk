import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Duplicate environment', () => {
  test('', async () => {
    const stashbase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

    const { error } = await onestash.environments.duplicate({
      project: 'hero-hub',
      name: 'aws',
      duplicateName: 'aws_copy',
    })

    console.log(error)
  })
})
