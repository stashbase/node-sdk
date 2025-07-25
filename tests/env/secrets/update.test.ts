import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Update env secrets', async () => {
  const client = createEnvClient('duIwyuCWOhJYpWQM3zmcGm0uGAJanqBS')

  const { data, error } = await client.secrets.update([
    {
      name: 'NEW_APP_URL',
      comment: 'THidhoihsdofhais',
      newName: 'APP_URL',
    },
  ])

  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)

    const { updatedCount, notFoundSecrets } = data
    console.log('updatedCount: ', updatedCount)
    console.log('notFoundSecrets: ', notFoundSecrets)
  }
})
