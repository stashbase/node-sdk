import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Delete specific secret from env - grant must be write or read/write', async () => {
  const envApi = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.secrets.removeAll()
  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log(data)
  }
})
