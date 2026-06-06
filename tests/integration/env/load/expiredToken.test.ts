import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('Returns exipred token error', async () => {
  const client = createEnvironmentClient(environmentTestConfig.invalidApiKey)

  const { error } = await client.environment.load({
    printSecrets: 'name',
  })

  if (error) {
    const { code } = error
  }
})
