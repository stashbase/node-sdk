// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../src'

test('Get specific env with env token and return variables with name', async () => {
  const envApi = createEnvApi('')

  const { data, error } = await envApi.get({
    printTable: false,
  })
  if (error) {
    console.log('Got an error')
    console.log(error.code)
  } else {
    const { name, secrets } = data
    console.log(name)
    console.log(secrets)
  }
})
