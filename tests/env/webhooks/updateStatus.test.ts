import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Update webhook status', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.webhooks.enable('whk_mtGrLXUhsUvA6rEhUJjrcd')

  if (error) {
    const { code } = error
    console.log(code)
  }
})
