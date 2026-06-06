import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('Create new secrets (add them to environment)', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.create([
    {
      name: 'KEY',
      value: 'Some value',
      comment: 'This is comment for this and this',
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
