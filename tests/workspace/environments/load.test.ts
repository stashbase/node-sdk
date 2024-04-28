import { describe, test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Should load environment', async () => {
  const envEase = createEnvEase('sbw_o2eAUw9fiIIkJk3myyXIYpPhECf3EtdGWnuCFfJMWbVkSuw9iOnMmnOc')

  const { data, error } = await envEase.environments.load({
    enabled: true,
    print: 'key',
    project: 'stashbase',
    environment: 'webhooks-testing',
  })

  console.log(data)
  console.log(error)
})
