import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('sets environment secrets', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { error } = await client.secrets.set([
    {
      name: 'NAME',
      value: 'value',
      comment: null,
    },
  ])
  if (error) {
    const { code } = error
    console.log('Error: ', error)
    console.log(code)
  }
})
