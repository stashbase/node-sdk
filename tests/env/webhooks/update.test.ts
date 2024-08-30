import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Update webhook', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.webhooks.update('wh_mtGrLXUhsUvA6rEhUJjrcd', {
    url: 'https://new-url.com',
    description: 'new description',
  })

  if (error) {
    const { code } = error
    console.log(code)
  }
})
