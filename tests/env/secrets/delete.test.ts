import { test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Delete specific secret from env - grant must be write or read/write', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { data, error } = await envApi.secrets.remove(['NEXT_PUBLIC_PRODUCTION_GITHUB_URL'])
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    const { deletedCount, notFoundSecrets } = data
    console.log('deletedCount: ', deletedCount)
    console.log('notFoundSecrets: ', notFoundSecrets)
  }
})
