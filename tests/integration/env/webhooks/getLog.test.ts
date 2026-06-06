import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('Get webhook log', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.getLog(
    'whk_mtGrLXUhsUvA6rEhUJjrcd',
    'whlog_m1DAScGeaJfFLSFUzTjiq8'
  )

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
