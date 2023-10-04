import { test } from 'vitest'
import { createEnvEase } from '../../../src'

test('Delete secrets', async () => {
  const envEase = createEnvEase('xPKDa2Xq0zWmfES1nLDoG45qZtR1z2qL')

  const { data, error } = await envEase.secrets.remove({
    project: 'hero-hub',
    environment: 'vercel',
    keys: ['SOME_KEY'],
  })
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    const { deletedCount, notFound } = data
    console.log('deletedCount: ', deletedCount)
    console.log('notFound: ', notFound)
  }
})
