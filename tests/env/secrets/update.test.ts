import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Update env secrets', async () => {
  const envApi = createEnvApi('duIwyuCWOhJYpWQM3zmcGm0uGAJanqBS')

  const { data, error } = await envApi.secrets.updateMany([
    {
      key: 'NEW_APP_URL',
      description: 'THidhoihsdofhais',
      newKey: 'APP_URL',
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
