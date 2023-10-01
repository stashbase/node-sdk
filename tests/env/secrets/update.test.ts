import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Update env secrets', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { data, error } = await envApi.secrets.update([
    {
      key: 'UPDATED_KEY',
      description: 'THidhoihsdofhais',
    },
    {
      key: 'SOme key',
      newKey: 'NEW_KEY',
      description: '123',
    },
  ])

  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)

    const { updatedCount, notFoundKeys } = data
    console.log('updatedCount: ', updatedCount)
    console.log('notFoundKeys: ', notFoundKeys)
  }
})
