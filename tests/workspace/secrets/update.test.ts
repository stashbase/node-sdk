import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Update secrets', async () => {
  const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

  const { data, error } = await envEase.secrets.update({
    project: 'hero-hub',
    environment: 'vercel',
    data: [
      {
        key: 'SOME_KEY',
        value: '123',
        description: 'New description',
      },
    ],
  })

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
