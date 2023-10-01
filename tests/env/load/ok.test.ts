import { assert, test } from 'vitest'
import { createEnvApi } from '../../../src'

test('Load specific env with env token and inject the variables into the process', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  await envApi.load({
    printTable: true,
  })

  console.log(process.env.JWT_SECRET_KEY)
  assert.exists(process.env.JWT_SECRET_KEY)
})
