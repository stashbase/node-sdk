import { test } from 'vitest'
import { createEnvClient } from '../../../src'

test('List webhook logs', async () => {
  const stashbase = createEnvClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await stashbase.webhooks.listLogs('wh_mtGrLXUhsUvA6rEhUJjrcd', {
    limit: 30,
  })

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
