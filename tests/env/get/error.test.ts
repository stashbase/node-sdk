// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Test unauthorized error', async () => {
  const envApi = createEnvApi('')

  const { data, error } = await envApi.get({
    secrets: true,
  })
  if (error) {
    console.log('Got an error')
    console.log(error.code === 'unauthorized')

    assert.equal(error.code, 'unauthorized')
  } else {
    const { name, secrets } = data
    console.log(name)
    console.log(secrets)
  }
})
