import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('Update webhook', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.update('whk_mtGrLXUhsUvA6rEhUJjrcd', {
    url: 'https://new-url.com',
    description: 'new description',
  })

  if (error) {
    const { code } = error
    console.log(code)
  }
})
