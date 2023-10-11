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
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)

    const { createdCount, duplicateKeys } = data
    console.log('createdCount: ', createdCount)
    console.log('duplicateKeys: ', duplicateKeys)
  }
})
