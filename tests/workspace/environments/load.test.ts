import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Should load environment', async () => {
  const envEase = createEnvEase(process.env.VITE_TEST_WORKSPACE_API_KEY as string)

  const { data, error, ok } = await envEase.environments.load({
    project: 'pr_nVpZPsL5nQTUP9yXU2GKYJ',
    environment: '123',
    print: 'key-value',
  })

  console.log(error)
})
