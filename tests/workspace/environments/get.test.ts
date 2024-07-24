import { assert, describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

describe('Get environment', () => {
  test('OK', async () => {
    const envEase = createEnvEase('')

    const { data, error } = await envEase.environments.get({
      project: 'hero-hub',
      environment: 'vercel',
    })

    console.log(data)
    console.log(error)
  })
})
