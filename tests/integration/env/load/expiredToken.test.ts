import { assert, test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('returns expired token error for invalid environment api key', async () => {
  const client = createEnvironmentClient(environmentTestConfig.invalidApiKey)

  const { error } = await client.environment.load({
    printSecrets: 'name',
  })

  if (error) {
    console.log(error)
  }
})
