import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Should load environment or throw an error', async () => {
  const envEase = createEnvEase('sbw_o2eAUw9fiIIkJk3myyXIYpPhECf3EtdGWnuCFfJMWbVkSuw9iOnMmnOc')

  try {
    await envEase.environments.loadOrThrow({
      print: 'key',
      project: 'stashbase',
      environment: 'webhooks-testing',
    })
  } catch (error) {
    console.log(error)
  }
})
