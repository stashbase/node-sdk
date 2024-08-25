import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Should load environment or throw an error', async () => {
  const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

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
