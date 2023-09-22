// tests/projects.test.ts
import { assert, test } from 'vitest'
import { createEnvEase } from '../../src'

test('Load env and inject the variables', async () => {
  const envEase = createEnvEase('AccessToken')

  // const projects = envEase.projects.list()
  // console.log(projects)
  await envEase.projects.environments.load({
    project: 'hero-hub-api',
    environment: 'local',
    options: {
      printTable: true,
    },
  })

  console.log(process.env.DATABASE_URL)

  assert.exists(process.env.DATABASE_URL)
})
