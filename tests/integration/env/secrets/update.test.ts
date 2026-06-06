import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('Update env secrets', async () => {
  const client = createEnvironmentClient('duIwyuCWOhJYpWQM3zmcGm0uGAJanqBS')

  const { data, error } = await client.secrets.update([
    {
      name: 'NEW_APP_URL',
      comment: 'THidhoihsdofhais',
      newName: 'APP_URL',
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
