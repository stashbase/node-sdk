import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Delete specific secret from env - grant must be write or read/write', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.delete(['NEXT_PUBLIC_PRODUCTION_GITHUB_URL'])
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    const { deletedCount, notFoundSecrets } = data
    console.log('deletedCount: ', deletedCount)
    console.log('notFoundSecrets: ', notFoundSecrets)
  }
})
