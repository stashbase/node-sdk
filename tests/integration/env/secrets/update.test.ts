import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'
import { environmentTestConfig } from '../environmentTestConfig'

test('Update env secrets', async () => {
  const client = createEnvironmentClient(environmentTestConfig.invalidApiKey)

  const { data, error } = await client.secrets.update([
    {
      name: 'NAME',
      newName: 'NEW_NAME',
    },
  ])

  if (error) {
    const { code, details } = error
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)

    console.log('updatedCount: ', data?.updatedCount)
    console.log('notFoundSecrets: ', data?.notFoundSecrets)
  }
})
