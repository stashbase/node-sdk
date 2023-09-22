// tests/projects.test.ts
import { test } from 'vitest'
import { createEnvEase } from '../src'

test('List projects', async () => {
  const envEase = createEnvEase('AccessToken')

  // const projects = envEase.projects.list()
  // console.log(projects)
  const environments = await envEase.projects.environments.list({ project: 'hero-hub-api' })

  console.log(environments)

  // Write your assertions here to test the results
  // For example:
  // assert.equal(projects.length, expectedProjectCount);
  // assert.include(projects[0].name, 'Expected Project Name');
})
