import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('Create webhook', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.webhooks.create({
    url: 'https://webhook.site/acdaf43b-caf1-4f9c-a667-061fc75197ea',
    enabled: true,
  })

  if (error) {
    console.log(error)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
