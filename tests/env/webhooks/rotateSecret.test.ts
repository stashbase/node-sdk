import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Get webhook signing secret', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.rotateSigningSecret('whk_mtGrLXUhsUvA6rEhUJjrcd')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data.signingSecret)
  }
})
