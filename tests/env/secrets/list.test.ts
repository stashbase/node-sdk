import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('List environment secrets', async () => {
  const envApi = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await envApi.secrets.list()
  if (error) {
    const { code } = error
    console.log(code )
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
