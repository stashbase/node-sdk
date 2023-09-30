// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../src'

test('Get specific env with env token and return variables with name', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  const { name, secrets } = await envApi.get({
    printTable: false,
  })

  console.log(name)
  console.log(secrets)
})
