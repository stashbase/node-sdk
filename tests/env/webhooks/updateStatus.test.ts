import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Update webhook status', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.enable('whk_mtGrLXUhsUvA6rEhUJjrcd')

  if (error) {
    const { code } = error
    console.log(code)
  }
})
