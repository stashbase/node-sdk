import { test } from 'vitest'
import { createEnvironmentClient } from '../../../../src'

test('Get environment secret metadata', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.getMetadata('NAME')

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})

test('List environment secrets metadata', async () => {
  const client = createEnvironmentClient(process.env.VITE_TEST_ENV_API_KEY as string)

  const { data, error } = await client.secrets.listMetadata()

  if (error) {
    const { code } = error
    console.log(code)
  } else {
    console.log('Data:\n')
    console.log(data)
  }
})
