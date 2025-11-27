import { test } from 'vitest'
import { createEnvironmentClient } from '../../../src'

test('List webhook logs', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.webhooks.listLogs('whk_mtGrLXUhsUvA6rEhUJjrcd', {
    pageSize: 30,
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
