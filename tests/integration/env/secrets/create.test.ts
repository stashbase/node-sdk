import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('creates environment secrets', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.create([
    {
      name: 'KEY',
      value: 'value',
      comment: 'comment',
    },
  ])
  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
