// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../src'

test('Get specific env with env token and return variables with name', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { data, error } = await envApi.get({})

  assert.equal(error, null)

  if (data) {
    console.log(data)

    const { name, secrets } = data
    console.log(name)
    console.log(secrets)
  }
})
