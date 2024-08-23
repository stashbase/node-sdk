import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Create new secrets (add them to environment)', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { data, error } = await envApi.secrets.create([
    {
      key: 'KEY',
      value: 'Some value',
      description: 'This is description for this and this',
    },
  ])
  if (error) {
    const { code } = error
    if (error.code === 'access.unsupported_api_key') {
      console.log('Supported api keys', error.details?.supportedApiKeyTypes)
    } else if (error.code === 'access.missing_permission') {
      console.log('Required permmissions', error.details?.requiredPermissions)
    } else if (error.code === 'auth.expired_api_key') {
      console.log('Expired api key', error.details?.expiredAt)
    }
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
