// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvApi } from '../../src'

test('Load specific env with env token and inject the variables into the process', async () => {
  const envApi = createEnvApi('-YSbVSq5kzmc1EgzAO9SThUXFQLjb6R1')

  await envApi.load({
    printTable: true,
    shouldThrow: true,
  })

  console.log(process.env.JWT_SECRET_KEY)
  assert.exists(process.env.JWT_SECRET_KEY)
})

// ROOT
// test('Load env and inject the variables', async () => {
//   const envEase = createEnvEase('AccessToken')
//
//   // const projects = envEase.projects.list()
//   // console.log(projects)
//   await envEase.projects.environments.load({
//     project: 'hero-hub-api',
//     environment: 'local',
//     options: {
//       printTable: true,
//     },
//   })
//
//   console.log(process.env.DATABASE_URL)
//
//   assert.exists(process.env.DATABASE_URL)
// })
