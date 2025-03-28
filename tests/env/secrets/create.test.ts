import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Create new secrets (add them to environment)', async () => {
  const envApi = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.secrets.create([
    {
      name: 'KEY',
      value: 'Some value',
      comment: 'This is comment for this and this',
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
