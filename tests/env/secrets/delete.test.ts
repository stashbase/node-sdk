import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Delete specific secret from env - grant must be write or read/write', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { notFound } = await envApi.secrets.remove(['123'])

  console.log(notFound)
})
