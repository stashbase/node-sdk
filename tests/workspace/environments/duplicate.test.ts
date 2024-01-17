import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Duplicate environment', () => {
  test('', async () => {
    const onestash = createEnvEase('evw_wMOnvAH3VHltWG43tS8g4u7FK9yZQCgu4QMLhO41jSj8IcQ6bxf5w6qr')

    const { error } = await onestash.environments.duplicate({
      project: 'hero-hub',
      name: 'aws',
      duplicateName: 'aws_copy',
    })

    console.log(error)
  })
})
